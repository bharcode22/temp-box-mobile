import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import RNFS from 'react-native-fs';

export const checkStoragePermissionSilent = async (
  setStoragePermissionGranted: (granted: boolean) => void
) => {
  if (Platform.OS !== 'android') {
    setStoragePermissionGranted(true);
    return;
  }

  try {
    // Test read di folder DCIM (Android 11+ akan melempar error jika All Files Access belum aktif)
    await RNFS.readDir(RNFS.ExternalStorageDirectoryPath + '/DCIM');
    setStoragePermissionGranted(true);
  } catch (e) {
    setStoragePermissionGranted(false);
  }
};

export const requestStoragePermission = async (
  addLog: (message: string, type: 'info' | 'success' | 'warn' | 'error') => void,
  setStoragePermissionGranted: (granted: boolean) => void
) => {
  if (Platform.OS !== 'android') return;

  addLog('Meminta izin akses penyimpanan...', 'info');

  try {
    let isGranted = false;

    if (Number(Platform.Version) >= 33) {
      // Android 13+ (API 33+) meminta izin granular media + notifikasi secara langsung
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ]);
      isGranted =
        granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      // Android 12 ke bawah meminta izin standard READ & WRITE
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      isGranted =
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;
    }

    if (!isGranted) {
      throw new Error('Izin ditolak oleh pengguna melalui pop-up sistem.');
    }

    // Coba akses folder DCIM untuk menguji apakah Scoped Storage memblokir pembacaan direktori
    await RNFS.readDir(RNFS.ExternalStorageDirectoryPath + '/DCIM');
    setStoragePermissionGranted(true);
    addLog('Izin penyimpanan berhasil didapatkan!', 'success');
    // Alert.alert('Sukses', 'Izin akses penyimpanan berhasil disetujui.');
  } catch (err: any) {
    addLog('Akses direktori penuh dibatasi oleh sistem Android.', 'warn');

    // Jika Android 11+ (API 30+), jelaskan dan arahkan ke pengaturan sistem untuk MANAGE_EXTERNAL_STORAGE
    if (Number(Platform.Version) >= 30) {
      Alert.alert(
        'Izin Pengelolaan Semua File Diperlukan',
        'Untuk Menyimpan Data Notes',
        [
          {
            text: 'Batal',
            onPress: () => addLog('Akses penyimpanan penuh ditolak.', 'error'),
            style: 'cancel'
          },
          {
            text: 'Buka Pengaturan',
            onPress: () => {
              Linking.openSettings();
              addLog('Membuka pengaturan aplikasi...', 'info');
            }
          }
        ]
      );
    } else {
      setStoragePermissionGranted(false);
      addLog(`Gagal mendapatkan izin: ${err.message}`, 'error');
    }
  }
};
