import RNFS from 'react-native-fs';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { DEFAULT_BASE_URL, DEFAULT_CLIENT_ID } from '../config';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  acceptedTermsAt?: string;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
}

export const getAuthPath = () => `${RNFS.DocumentDirectoryPath}/auth.json`;

// Inisialisasi Google Sign-In dengan Web Client ID dari .env
export const initGoogleSignIn = () => {
  try {
    const webClientId = DEFAULT_CLIENT_ID || '';
    if (webClientId) {
      GoogleSignin.configure({
        webClientId: webClientId,
        offlineAccess: false,
      });
      console.log('✅ Google Sign-In berhasil dikonfigurasi dengan Client ID:', webClientId);
    } else {
      console.warn('⚠️ CLIENT_ID tidak terdefinisi di .env');
    }
  } catch (err: any) {
    console.error('❌ Gagal inisialisasi Google Sign-In:', err.message);
  }
};

// Memuat data auth yang tersimpan di memori internal HP
export const loadSavedAuth = async (): Promise<AuthSession | null> => {
  try {
    const path = getAuthPath();
    const fileExists = await RNFS.exists(path);
    if (fileExists) {
      const content = await RNFS.readFile(path, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed?.token && parsed?.user) {
        return parsed;
      }
    }
  } catch (err: any) {
    console.error('❌ Gagal membaca session auth:', err.message);
  }
  return null;
};

// Menyimpan data token JWT & user ke memori internal HP
export const saveAuthSession = async (token: string, user: UserProfile): Promise<boolean> => {
  try {
    const session: AuthSession = { token, user };
    await RNFS.writeFile(getAuthPath(), JSON.stringify(session), 'utf8');
    return true;
  } catch (err: any) {
    console.error('❌ Gagal menyimpan session auth:', err.message);
    return false;
  }
};

// Menghapus data auth (Logout)
export const logoutAuth = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
  } catch (_) {}
  try {
    const path = getAuthPath();
    const fileExists = await RNFS.exists(path);
    if (fileExists) {
      await RNFS.unlink(path);
    }
    console.log('🔒 Auth session berhasil dihapus (Logout).');
  } catch (err: any) {
    console.error('❌ Gagal logout auth:', err.message);
  }
};

// Fungsi utama Login Google: panggil SDK Google -> kirim ID Token ke Backend -> simpan Session
export const signInWithGoogle = async (): Promise<AuthSession> => {
  try {
    initGoogleSignIn();

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    // Dapatkan idToken dari response Google Sign-In
    const idToken = response.data?.idToken || (response as any).idToken;

    if (!idToken) {
      throw new Error('Google ID Token tidak ditemukan dari proses login.');
    }

    const baseUrl = (DEFAULT_BASE_URL || '').replace(/\/$/, '');
    if (!baseUrl) {
      throw new Error('BASE_URL belum dikonfigurasi di file .env');
    }

    console.log('🔑 Mengirim Google ID Token ke Backend:', `${baseUrl}/api/auth/google`);

    const apiRes = await fetch(`${baseUrl}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential: idToken }),
    });

    const resData = await apiRes.json();

    if (!apiRes.ok) {
      throw new Error(resData.error || resData.message || 'Gagal memverifikasi login Google ke Backend');
    }

    if (!resData.token || !resData.user) {
      throw new Error('Respon backend tidak valid (token atau data user kosong).');
    }

    const session: AuthSession = {
      token: resData.token,
      user: resData.user,
    };

    await saveAuthSession(session.token, session.user);
    console.log('🎉 Berhasil Login Google! User:', session.user.email);

    return session;
  } catch (err: any) {
    const isDeveloperError =
      err.code === 'DEVELOPER_ERROR' ||
      err.code === '10' ||
      (err.message && err.message.includes('DEVELOPER_ERROR'));

    if (isDeveloperError) {
      throw new Error('DEVELOPER_ERROR (Code 10): SHA-1 Fingerprint (5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25) atau Web Client ID belum sesuai di Google Cloud Console untuk package name com.privatebox.mobile');
    } else if (err.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('Proses login Google dibatalkan.');
    } else if (err.code === statusCodes.IN_PROGRESS) {
      throw new Error('Proses login Google sedang berjalan.');
    } else if (err.message && (err.message.includes('RNGoogleSignin') || err.message.includes('TurboModuleRegistry'))) {
      throw new Error('Native Module "RNGoogleSignin" belum terpasang di biner APK. Harap jalankan ulang `npm run android` di terminal Anda.');
    }
    throw err;
  }
};

