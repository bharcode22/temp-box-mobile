# 📱 Panduan Setup & Menjalankan Mobile App (`temp-box-mobile`)

Catatan ini merangkum seluruh dependensi sistem, environment variables, konfigurasi kritis, dan langkah-langkah untuk menjalankan aplikasi dari awal.

---

## 1. Prasyarat Sistem (System Requirements)

Pastikan tools berikut sudah terpasang di sistem Windows Anda:

| Komponen | Versi yang Digunakan | Lokasi / Catatan |
|---|---|---|
| **Node.js** | `v22.x` (LTS) | Pastikan `node` & `npm` dikenali di PowerShell |
| **JDK (Java)** | **JDK 17 LTS (Eclipse Temurin)** | `C:\Program Files\Eclipse Adoptium\jdk-17.0.20.8-hotspot` *(Jangan gunakan Java 25 untuk build Android)* |
| **Android SDK** | API 34 - 36 & Platform-Tools | `C:\Users\ASUS TUF\AppData\Local\Android\Sdk` |
| **Android NDK** | `27.1.12297006` | Terpasang di dalam folder SDK Android |
| **Android Emulator** | Pixel / AVD Device | Terhubung via `adb devices` (contoh: `emulator-5554`) |

---

## 2. Environment Variables Penting

Jalankan perintah ini di PowerShell (atau simpan di System Environment Variables):

```powershell
$jdk17Path = "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.8-hotspot"
$env:JAVA_HOME = $jdk17Path
$env:ANDROID_HOME = "C:\Users\ASUS TUF\AppData\Local\Android\Sdk"
$env:Path = "$jdk17Path\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:Path"
```

---

## 3. Konfigurasi File `.env`

Buat atau pastikan file `.env` berada di root `temp-box-mobile/.env`:

```env
DEFAULT_VPS_URL=https://your-backend-vps-url.com
DEFAULT_API_KEY=your_secret_api_key
DEFAULT_BASE_URL=https://your-backend-vps-url.com
DEFAULT_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

---

## 4. Konfigurasi Kritis Proyek (Wajib Ada)

### A. `react-native.config.js` (Di Root Project)
File ini mencegah error kompilasi native Java dari `react-native-reanimated` dan mengatur package name:

```javascript
module.exports = {
  dependencies: {
    'react-native-reanimated': {
      platforms: {
        android: null, // Matikan autolinking native Android (hanya pakai JS runtime untuk NativeWind)
        ios: null,
      },
    },
    'react-native-worklets': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
  project: {
    android: {
      packageName: 'com.anonymous.wordpuzzle',
    },
  },
};
```

### B. `MainActivity.kt`
Pastikan `override fun onCreate` ada untuk mendukung `react-native-screens`:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
}
```

---

## 5. Langkah Instalasi Dependensi (Awal Setup)

Jalankan di folder `temp-box-mobile`:

```powershell
# 1. Install dependensi utama
npm install --legacy-peer-deps

# 2. Pastikan paket pendukung ini terpasang jika baru clone/pindah branch:
npm install @react-native-google-signin/google-signin react-native-reanimated@3.15.0 react-native-worklets --legacy-peer-deps
```

---

## 6. Cara Menjalankan Aplikasi

### Terminal 1: Jalankan Metro Bundler
```powershell
cd "c:\Users\ASUS TUF\Documents\pinggiran\temp-box\temp-box-mobile"
npm start
```

### Terminal 2: Build & Pasang ke Simulator
*(Pastikan Android Simulator sudah menyala)*

```powershell
cd "c:\Users\ASUS TUF\Documents\pinggiran\temp-box\temp-box-mobile"
npm run android
```

---

## 7. Tips & Perintah Tambahan

- **Forward Port Metro ke Emulator**:
  ```powershell
  adb reverse tcp:8081 tcp:8081
  ```
- **Buka React Native Dev Menu di Simulator**:
  ```powershell
  adb shell input keyevent 82
  ```
- **Reload Aplikasi**: Tekan **`r`** pada terminal Metro Bundler.
- **Bebaskan Port 8081 jika error EADDRINUSE**:
  ```powershell
  Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  ```
