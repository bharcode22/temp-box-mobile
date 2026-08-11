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

// Constants
import { DEFAULT_VPS_URL, DEFAULT_API_KEY } from '../config';

// Styles
import { styles } from '../styles/App.styles';

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
    <View style={{ flex: 1, backgroundColor: '#2A0825' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#2A0825" />
        <Header title="Setting" subtitle="Setting Screen" Icon={Settings} />

        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
          {/* <ConfigCard
            vpsUrl={vpsUrl}
            setVpsUrl={setVpsUrl}
            apiKey={apiKey}
            setApiKey={setApiKey}
            deviceId={deviceId}
            setDeviceId={setDeviceId}
          /> */}

          {/* <PermissionCard
            storagePermissionGranted={storagePermissionGranted}
            onRequestPermission={() => requestStoragePermission(addLog, setStoragePermissionGranted)}
          /> */}

          {/* <ControlCard
            connectionStatus={connectionStatus}
            isBgActive={isBgActive}
            onConnectToggle={handleConnectToggle}
            onBgServiceToggle={handleBgServiceToggle}
          /> */}

          {/* <ConsoleLog logs={logs} /> */}

          {/* VPS Connection Status Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Koneksi Database</Text>

            {/* Status Koneksi */}
            <View style={[styles.statusRow]}>
              <Text style={styles.statusLabel}>V1.0.0:</Text>
              {/* <Text style={[styles.statusVal, {
                color: connectionStatus === 'connected' ? '#FF5E97'
                  : connectionStatus === 'connecting' ? '#F59E0B'
                    : connectionStatus === 'error' ? '#EF4444'
                      : '#FFF385',
                fontWeight: 'bold',
              }]}>
                {connectionStatus === 'connected' ? '● Aktif'
                  : connectionStatus === 'connecting' ? '● Menghubungkan...'
                    : connectionStatus === 'error' ? '● Error'
                      : '● Terputus'}
              </Text> */}
            </View>

            {/* Tombol Reconnect */}
            <TouchableOpacity
              style={[styles.actionButton, {
                backgroundColor: connectionStatus === 'connected' ? '#FFF385' : '#FF5E97',
                marginTop: 12,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isReconnecting ? 1 : 1,
              }]}
              onPress={handleReconnect}
              disabled={isReconnecting}
            >
              <RefreshCw
                color="#2A0825"
                size={16}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>
                {isReconnecting ? 'Menghubungkan...' : connectionStatus === 'connected' ? 'Check Update' : 'Checking Update...'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
