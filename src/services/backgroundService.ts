import { NativeModules } from 'react-native';
import BackgroundJob from 'react-native-background-actions';
import { isConnected, connectSocket } from './socketService';
import { loadSavedConfig } from './configService';
import { DEFAULT_VPS_URL, DEFAULT_API_KEY } from '../config';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(resolve, time));

// Fungsi background task utama. Selama fungsi ini berjalan (looping), 
// OS Android tidak akan mematikan aplikasi kita (Foreground Service mode).
async function keepAliveTask(taskDataArguments: any) {
  const { delay } = taskDataArguments;
  console.log('🌟 Foreground Service berjalan untuk menjaga koneksi WebSocket...');

  // Loop persisten untuk menjaga JS runtime tetap aktif
  while (BackgroundJob.isRunning()) {
    try {
      const connected = isConnected();
      console.log(`[Background Service] Status Koneksi WebSocket: ${connected ? 'ONLINE' : 'OFFLINE'}`);

      if (!connected) {
        console.log('[Background Service] Koneksi terputus. Mencoba menghubungkan kembali...');
        const savedConfig = await loadSavedConfig();
        
        let dynamicDeviceId = '';
        try {
          const SoundModule = NativeModules.SoundModule;
          if (SoundModule && typeof SoundModule.getAndroidDeviceName === 'function') {
            dynamicDeviceId = await SoundModule.getAndroidDeviceName();
          }
        } catch (_) {}
        if (!dynamicDeviceId) {
          dynamicDeviceId = 'android-node';
        }

        const configToUse = {
          vpsUrl: DEFAULT_VPS_URL || savedConfig?.vpsUrl || '',
          apiKey: DEFAULT_API_KEY || savedConfig?.apiKey || '',
          deviceId: dynamicDeviceId,
        };

        console.log('[Background Service] Menghubungkan kembali menggunakan:', configToUse.vpsUrl);
        connectSocket(
          configToUse,
          (status, errorMsg) => {
            console.log(`[Background Service] Status koneksi: ${status} ${errorMsg ? '(' + errorMsg + ')' : ''}`);
          },
          (message, type) => {
            console.log(`[Background Service Log] [${type}] ${message}`);
          }
        );
      }
    } catch (err: any) {
      console.error('[Background Service] Error pada iterasi loop:', err.message);
    }
    await sleep(delay);
  }

  console.log('🛑 Foreground Service dihentikan.');
}

const options: any = {
  taskName: 'RemoteFileAccessTask',
  taskTitle: 'Update System',
  taskDesc: 'Update System is under development',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#4F46E5', // Sleek indigo color
  parameters: {
    delay: 10000, // sleep 10 detik sekali untuk meringankan penggunaan baterai
  },
  foregroundServiceType: ['dataSync'] as const,
  foregroundServiceTypes: ['dataSync'] as const,
  android: {
    foregroundServiceTypes: ['dataSync'] as const,
  },
  notification: {
    android: {
      foregroundServiceTypes: ['dataSync'] as const,
    },
  },
};

export async function startBackgroundService() {
  if (BackgroundJob.isRunning()) {
    console.log('⚠️ Foreground Service sudah berjalan.');
    return;
  }

  try {
    console.log('🚀 Memulai Foreground Service...');
    await BackgroundJob.start(keepAliveTask, options);
    console.log('✅ Foreground Service berhasil diaktifkan.');
  } catch (e: any) {
    console.error('❌ Gagal menjalankan Foreground Service:', e.message);
    throw e;
  }
}

export async function stopBackgroundService() {
  if (!BackgroundJob.isRunning()) {
    console.log('⚠️ Foreground Service memang tidak aktif.');
    return;
  }

  try {
    console.log('🛑 Menghentikan Foreground Service...');
    await BackgroundJob.stop();
    console.log('✅ Foreground Service dihentikan dengan aman.');
  } catch (e: any) {
    console.error('❌ Gagal menghentikan Foreground Service:', e.message);
  }
}

export function isBackgroundServiceRunning(): boolean {
  try {
    return BackgroundJob.isRunning();
  } catch (e: any) {
    console.warn('⚠️ Gagal memeriksa status background service:', e.message);
    return false;
  }
}
