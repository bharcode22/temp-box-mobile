import React, { useState, useEffect } from 'react';
import { View, ScrollView, StatusBar, Alert, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Services
import { connectSocket, disconnectSocket } from '../services/socketService';
import { startBackgroundService, stopBackgroundService, isBackgroundServiceRunning } from '../services/backgroundService';
import { loadSavedConfig, saveConfig } from '../services/configService';
import { requestStoragePermission } from '../services/permissionService';

// Components
import { Header } from '../components/Header';
import { Settings, RefreshCw } from 'lucide-react-native';
import { ConfigCard } from '../components/ConfigCard';
import { PermissionCard } from '../components/PermissionCard';
import { ControlCard } from '../components/ControlCard';
import { ConsoleLog } from '../components/ConsoleLog';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { GradientButton } from '../components/GradientButton';

// Constants
import { DEFAULT_VPS_URL, DEFAULT_API_KEY } from '../config';

interface AppLog {
  time: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

export const SettingsScreen: React.FC = () => {

  // Form Config
  const [vpsUrl, setVpsUrl] = useState(DEFAULT_VPS_URL);
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [deviceId, setDeviceId] = useState('');

  // Statuses
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [socketError, setSocketError] = useState('');
  const [isBgActive, setIsBgActive] = useState(false);
  const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Custom logger console
  const [logs, setLogs] = useState<AppLog[]>([]);

  // Tambahkan log ke console layar
  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prevLogs => [...prevLogs, { time, message, type }].slice(-100));
  };


  // Fungsi pembantu untuk koneksi ke VPS
  const connectToVps = (url: string, key: string, id: string) => {
    if (!url) return;

    addLog(`Menghubungkan ke VPS: ${url}...`, 'info');

    connectSocket(
      { vpsUrl: url, apiKey: key, deviceId: id },
      (status, errorMsg) => {
        setConnectionStatus(status);
        if (status === 'error' && errorMsg) {
          setSocketError(errorMsg);
          addLog(`Gagal terkoneksi: ${errorMsg}`, 'error');
        } else if (status === 'connected') {
          setSocketError('');
          addLog(`WebSocket terhubung. ID Perangkat: ${id}`, 'success');
        } else if (status === 'disconnected') {
          addLog('WebSocket terputus.', 'warn');
        }
      },
      (message, type) => {
        addLog(message, type);
      }
    );
  };

  // Muat konfigurasi yang disimpan sebelumnya dan hubungkan otomatis
  useEffect(() => {
    const loadSavedConfigAndConnect = async () => {
      let activeVpsUrl = vpsUrl;
      let activeApiKey = apiKey;
      let activeDeviceId = deviceId;

      const saved = await loadSavedConfig();
      if (saved) {
        if (saved.vpsUrl) {
          setVpsUrl(saved.vpsUrl);
          activeVpsUrl = saved.vpsUrl;
        }
        if (saved.apiKey) {
          setApiKey(saved.apiKey);
          activeApiKey = saved.apiKey;
        }
        if (saved.deviceId) {
          setDeviceId(saved.deviceId);
          activeDeviceId = saved.deviceId;
        }
        addLog('Konfigurasi lama berhasil dimuat.', 'info');
      }

      // Hubungkan otomatis setelah memuat konfigurasi
      if (activeVpsUrl) {
        connectToVps(activeVpsUrl, activeApiKey, activeDeviceId);
      }
    };

    loadSavedConfigAndConnect();
    requestStoragePermission(addLog, setStoragePermissionGranted);

    // Perbarui status running background service saat start
    setIsBgActive(isBackgroundServiceRunning());
  }, []);

  // Handle koneksi WebSocket
  const handleConnectToggle = async () => {
    if (connectionStatus === 'connected' || connectionStatus === 'connecting') {
      // Putuskan koneksi
      disconnectSocket();
      setConnectionStatus('disconnected');
      addLog('Koneksi WebSocket diputus.', 'info');
    } else {
      // Hubungkan koneksi
      if (!vpsUrl) {
        Alert.alert('Error', 'VPS URL tidak boleh kosong');
        return;
      }

      // Simpan config ke file
      await saveConfig(vpsUrl, apiKey, deviceId);
      connectToVps(vpsUrl, apiKey, deviceId);
    }
  };

  // Handle Foreground Service Toggle
  const handleBgServiceToggle = async () => {
    try {
      if (isBgActive) {
        await stopBackgroundService();
        setIsBgActive(false);
        addLog('Foreground Service dinonaktifkan.', 'warn');
      } else {
        await startBackgroundService();
        setIsBgActive(true);
        addLog('Foreground Service diaktifkan (tetap aktif di background).', 'success');
      }
    } catch (err: any) {
      addLog(`Gagal mengubah status service: ${err.message}`, 'error');
    }
  };

  // Handle Reconnect ke VPS
  const handleReconnect = async () => {
    if (isReconnecting) return;
    setIsReconnecting(true);
    try {
      // Putuskan koneksi aktif terlebih dahulu
      disconnectSocket();
      setConnectionStatus('disconnected');
      addLog('Memutus koneksi sebelumnya...', 'info');

      // Muat ulang konfigurasi terbaru lalu sambungkan ulang
      const saved = await loadSavedConfig();
      const url = saved?.vpsUrl || vpsUrl;
      const key = saved?.apiKey || apiKey;
      const id = saved?.deviceId || deviceId;

      if (!url) {
        Alert.alert('Gagal Reconnect', 'VPS URL belum dikonfigurasi.');
        return;
      }

      if (saved) {
        setVpsUrl(url);
        setApiKey(key);
        setDeviceId(id);
      }

      addLog(`Reconnecting ke ${url} sebagai Device: ${id}...`, 'info');
      connectToVps(url, key, id);
    } catch (err: any) {
      addLog(`Gagal reconnect: ${err.message}`, 'error');
    } finally {
      setIsReconnecting(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-950" style={{ flex: 1, backgroundColor: '#090d16' }}>
      <BackgroundGlow />
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="light-content" backgroundColor="#090d16" />
        <Header subtitle="Settings" />

        <ScrollView className="flex-1 p-4" keyboardShouldPersistTaps="handled">
          {/* VPS Connection Status Card */}
          <View className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 mb-4 shadow-lg">
            <Text className="text-base font-bold text-slate-50 mb-3">Koneksi Database</Text>

            {/* Status Koneksi */}
            <View className="flex-row items-center mb-2">
              <Text className="text-sm font-semibold text-slate-400 mr-2">V1.0.0:</Text>
            </View>

            {/* Tombol Reconnect Bergradasi */}
            <GradientButton
              title={isReconnecting ? 'Menghubungkan...' : connectionStatus === 'connected' ? 'Check Update' : 'Checking Update...'}
              Icon={RefreshCw}
              onPress={handleReconnect}
              disabled={isReconnecting}
              colors={connectionStatus === 'connected' ? ['#334155', '#1E293B'] : ['#4F46E5', '#7C3AED']}
              style={{ marginTop: 12 }}
            />
          </View>

          {/* Spacer */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
