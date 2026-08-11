import { requestStoragePermission } from './permissionService';
import { connectSocket } from './socketService';
import { startBackgroundService } from './backgroundService';
import { loadSavedConfig, saveConfig } from './configService';
import { DEFAULT_VPS_URL, DEFAULT_API_KEY } from '../config';
import { NativeModules } from 'react-native';

export const initializeAppAtStartup = async () => {

  // 2. Meminta izin penyimpanan Android secara otomatis
  await requestStoragePermission(
    (msg, type) => console.log(`[App Root Permission Log] [${type}] ${msg}`),
    (granted) => console.log(`[App Root Permission Status] Izin didapatkan: ${granted}`)
  );

  // 3. Aktifkan Background Service secara instan
  try {
    await startBackgroundService();
    console.log('[App Root Startup] Background Service diaktifkan otomatis.');
  } catch (err: any) {
    console.warn('[App Root Startup] Gagal mengaktifkan Background Service:', err.message);
  }

  // 4. Muat konfigurasi terakhir dan hubungkan ke VPS WebSocket (tulis konfigurasi default jika kosong)
  try {
    let savedConfig = await loadSavedConfig();

    // Dapatkan ID perangkat secara dinamis dari Native Module terlebih dahulu
    let dynamicDeviceId = '';
    try {
      const SoundModule = NativeModules.SoundModule;
      if (SoundModule && typeof SoundModule.getAndroidDeviceName === 'function') {
        dynamicDeviceId = await SoundModule.getAndroidDeviceName();
        console.log(`[App Root Startup] Berhasil mendapatkan ID perangkat dinamis: ${dynamicDeviceId}`);
      }
    } catch (err: any) {
      console.warn('[App Root Startup] Gagal mendapatkan ID perangkat dari hardware. Menggunakan fallback...', err.message);
    }

    // Fallback acak unik jika native module tidak merespon (misal simulator)
    if (!dynamicDeviceId || dynamicDeviceId === 'undefined' || dynamicDeviceId === 'null') {
      dynamicDeviceId = 'android-' + Math.random().toString(36).substring(2, 10);
      console.log(`[App Root Startup] Menggunakan fallback ID acak: ${dynamicDeviceId}`);
    }

    // Selalu prioritaskan nilai dari .env — jika .env berisi nilai, gunakan itu
    // Fallback ke savedConfig hanya jika .env tidak terdefinisi
    const finalVpsUrl = DEFAULT_VPS_URL || savedConfig?.vpsUrl || '';
    const finalApiKey = DEFAULT_API_KEY || savedConfig?.apiKey || '';

    const configToUse = {
      vpsUrl: finalVpsUrl,
      apiKey: finalApiKey,
      deviceId: dynamicDeviceId,
    };

    // Simpan config terbaru ke device agar backgroundService juga ikut terupdate
    await saveConfig(configToUse.vpsUrl, configToUse.apiKey, configToUse.deviceId);

    console.log('[App Root Startup] Menghubungkan otomatis ke VPS:', configToUse.vpsUrl);
    connectSocket(
      configToUse,
      (status, errorMsg) => {
        console.log(`[App Root Startup Socket] Status: ${status} ${errorMsg ? '(' + errorMsg + ')' : ''}`);
      },
      (message, type) => {
        console.log(`[App Root Startup Socket Log] [${type}] ${message}`);
      }
    );
  } catch (err: any) {
    console.warn('[App Root Startup] Gagal memuat/menyimpan konfigurasi VPS:', err.message);
  }
};
