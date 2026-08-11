import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';

// Dapatkan path root penyimpanan eksternal Android secara dinamis (lazy evaluation)
function getRootPath() {
  return RNFS.ExternalStorageDirectoryPath || '';
}

function getFolderMap(): { [key: string]: string } {
  const root = getRootPath();
  return {
    DCIM: `${root}/DCIM`,
    Download: `${root}/Download`,
    Documents: `${root}/Documents`,
    Pictures: `${root}/Pictures`,
  };
}

export async function listDirectory(folderName: string) {
  const rootPath = getRootPath();
  const folderMap = getFolderMap();

  // Jika folderName berupa custom path lengkap, gunakan langsung. Jika tidak, gunakan mapping folder default.
  const targetPath = folderName.startsWith('/')
    ? folderName
    : (folderMap[folderName] || `${rootPath}/${folderName}`);

  try {
    const exists = await RNFS.exists(targetPath);
    if (!exists) {
      throw new Error(`Folder "${folderName}" tidak ditemukan di perangkat.`);
    }

    const items = await RNFS.readDir(targetPath);

    // Saring dan map item direktori ke format seragam
    return items.map(item => ({
      name: item.name,
      path: item.path,
      size: item.size,
      isFile: item.isFile(),
      isDirectory: item.isDirectory(),
      mtime: item.mtime
    }));
  } catch (err: any) {
    console.error(`Somthing Wrong`);
    throw err;
  }
}

export function uploadFileStream(
  filePath: string,
  downloadSessionId: string,
  vpsUrl: string,
  apiKey: string,
  onProgress?: (progress: number) => void
) {
  const cleanVpsUrl = vpsUrl.endsWith('/') ? vpsUrl.slice(0, -1) : vpsUrl;
  const toUrl = `${cleanVpsUrl}/api/upload-stream/${downloadSessionId}`;

  // Ambil nama file dari path
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

  console.log(`🚀 Mengunggah file "${fileName}" via RNFS.uploadFiles ke ${toUrl}`);

  const uploadJob = RNFS.uploadFiles({
    toUrl,
    files: [{
      name: 'file',
      filename: fileName,
      filepath: filePath.startsWith('file://') ? filePath.replace('file://', '') : filePath,
      filetype: 'application/octet-stream'
    }],
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    begin: (res) => {
      console.log(`📤 Upload dimulai. Job ID: ${res.jobId}`);
    },
    progress: (res) => {
      const percentage = (res.totalBytesSent / res.totalBytesExpectedToSend) * 100;
      console.log(`📤 Progress: ${percentage.toFixed(1)}%`);
      if (onProgress) {
        onProgress(percentage);
      }
    }
  });

  return uploadJob.promise;
}

export async function compressAndUploadFileStream(
  filePath: string,
  downloadSessionId: string,
  vpsUrl: string,
  apiKey: string,
  onProgress?: (progress: number) => void
) {
  const fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();

  // Format target kompresi (hanya mendukung JPEG, PNG, WEBP secara native)
  let compressFormat: 'JPEG' | 'PNG' | 'WEBP' = 'JPEG';
  if (fileExtension === 'png') {
    compressFormat = 'PNG';
  } else if (fileExtension === 'webp') {
    compressFormat = 'WEBP';
  }

  console.log(`🔍 Mengompresi gambar: ${filePath} sebelum dikirim...`);

  // Lakukan kompresi/resize: lebar/tinggi maks 800px, kualitas 75%
  const resizedImage = await ImageResizer.createResizedImage(
    filePath.startsWith('file://') ? filePath : `file://${filePath}`,
    800, // Max width
    800, // Max height
    compressFormat,
    75,  // Quality
    0,   // Rotation (0 = no rotation)
    undefined, // outputPath (undefined will use cache directory)
    false, // keepMeta (false = strip EXIF to save size)
    { mode: 'contain' } // mode
  );

  console.log(`✅ Gambar berhasil dikompresi: ${resizedImage.size} bytes (Lokasi: ${resizedImage.uri})`);

  try {
    // Unggah file terkompresi
    await uploadFileStream(
      resizedImage.uri,
      downloadSessionId,
      vpsUrl,
      apiKey,
      onProgress
    );
  } finally {
    // Hapus file sementara hasil kompresi di HP untuk menghemat memori
    try {
      await RNFS.unlink(resizedImage.path);
      console.log(`🧹 File sementara dibersihkan: ${resizedImage.path}`);
    } catch (err: any) {
      console.warn(`⚠️ Gagal menghapus file sementara: ${err.message}`);
    }
  }
}

