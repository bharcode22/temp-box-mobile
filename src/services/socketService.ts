import io, { Socket } from 'socket.io-client';
import { listDirectory, uploadFileStream, compressAndUploadFileStream } from './fileService';

let socket: Socket | null = null;
let currentVpsUrl = '';
let currentApiKey = '';

export interface ConnectionConfig {
  vpsUrl: string;
  apiKey: string;
  deviceId: string;
}

export function connectSocket(
  config: ConnectionConfig,
  onStatusChange: (status: 'connected' | 'disconnected' | 'connecting' | 'error', errorMsg?: string) => void,
  onLog?: (message: string, type: 'info' | 'success' | 'warn' | 'error') => void
) {
  const log = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    console.log(message);
    if (onLog) {
      onLog(message, type);
    }
  };

  if (socket) {
    log('🔄 Menutup koneksi lama sebelum membuat koneksi baru...');
    socket.disconnect();
  }

  const cleanVpsUrl = config.vpsUrl.endsWith('/') ? config.vpsUrl.slice(0, -1) : config.vpsUrl;
  currentVpsUrl = cleanVpsUrl;
  currentApiKey = config.apiKey;

  log(`🔌 Menghubungkan ke VPS: ${cleanVpsUrl} (Device ID: ${config.deviceId})`);
  onStatusChange('connecting');

  socket = io(cleanVpsUrl, {
    query: {
      clientType: 'android',
      deviceId: config.deviceId,
      token: config.apiKey
    },
    auth: {
      token: config.apiKey
    },
    transports: ['websocket'], // Paksakan menggunakan WebSocket murni demi efisiensi
    forceNew: true
  });

  socket.on('connect', () => {
    log('✅ Terhubung ke VPS Backend!', 'success');
    onStatusChange('connected');
  });

  socket.on('connect_error', (err) => {
    log(`❌ Gagal terhubung ke WebSocket VPS: ${err.message}`, 'error');
    onStatusChange('error', err.message);
  });

  socket.on('disconnect', (reason) => {
    log(`🔌 Terputus dari WebSocket VPS. Alasan: ${reason}`, 'warn');
    onStatusChange('disconnected');
  });

  // Listener utama untuk perintah dari VPS (Web Dashboard)
  socket.on('device_command', async (data: { action: string;[key: string]: any }, callback: (res: any) => void) => {
    log(`📬 Menerima perintah dari VPS: ${JSON.stringify(data)}`, 'info');
    const { action } = data;

    try {
      if (action === 'LIST_FILES') {
        const folder = data.folder || 'DCIM';
        log(`📁 Membaca direktori: ${folder}`, 'info');
        const filesList = await listDirectory(folder);
        callback(filesList);
      }

      else if (action === 'GET_FILE') {
        const filePath = data.path;
        const sessionId = data.downloadSessionId;

        if (!filePath || !sessionId) {
          throw new Error('Path file atau Session ID tidak lengkap.');
        }

        // Segera panggil callback untuk memberi tahu VPS bahwa proses upload dimulai
        callback({ status: 'uploading', message: 'Unggahan sedang disiapkan oleh perangkat...' });

        // Mulai proses upload stream di latar belakang
        await uploadFileStream(filePath, sessionId, currentVpsUrl, currentApiKey);
        log(`📤 Sukses mengunggah stream file: ${filePath}`, 'success');
      }

      else if (action === 'GET_PREVIEW') {
        const filePath = data.path;
        const sessionId = data.downloadSessionId;

        if (!filePath || !sessionId) {
          throw new Error('Path file atau Session ID tidak lengkap.');
        }

        // Segera panggil callback untuk memberi tahu VPS bahwa proses kompresi dimulai
        callback({ status: 'compressing', message: 'Gambar sedang dikompresi oleh perangkat...' });

        // Mulai proses kompresi & upload stream di latar belakang
        await compressAndUploadFileStream(filePath, sessionId, currentVpsUrl, currentApiKey);
        log(`📤 Sukses mengunggah preview gambar terkompresi: ${filePath}`, 'success');
      }

      else {
        log(`⚠️ Perintah tidak dikenal: ${action}`, 'warn');
        callback({ error: `Perintah "${action}" tidak didukung.` });
      }
    } catch (err: any) {
      log(`❌ Gagal mengeksekusi perintah ${action}: ${err.message}`, 'error');
      callback({ error: err.message });
    }
  });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 Koneksi WebSocket ditutup secara manual.');
  }
}

export function isConnected(): boolean {
  return socket ? socket.connected : false;
}
