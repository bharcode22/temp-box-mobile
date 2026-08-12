import React, { useState, useEffect } from 'react';
import { View, ScrollView, StatusBar, Alert, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogOut, ShieldCheck, Settings, RefreshCw, Sparkles, Cpu, HardDrive } from 'lucide-react-native';

// Services
import { connectSocket, disconnectSocket } from '../services/socketService';
import { startBackgroundService, stopBackgroundService, isBackgroundServiceRunning } from '../services/backgroundService';
import { loadSavedConfig, saveConfig } from '../services/configService';
import { requestStoragePermission } from '../services/permissionService';
import { loadSavedAuth, logoutAuth, UserProfile } from '../services/authService';

// Components
import { Header } from '../components/Header';
import { ConfigCard } from '../components/ConfigCard';
import { PermissionCard } from '../components/PermissionCard';
import { ControlCard } from '../components/ControlCard';
import { ConsoleLog } from '../components/ConsoleLog';
import { BackgroundGlow } from '../components/BackgroundGlow';

// Constants
import { DEFAULT_VPS_URL, DEFAULT_API_KEY } from '../config';

interface AppLog {
  time: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

interface AccountScreenProps {
  user: UserProfile | null;
  onLogout: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ user, onLogout }) => {
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

  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prevLogs => [...prevLogs, { time, message, type }].slice(-100));
  };

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
        addLog('Konfigurasi lama berhasil dimuat.', 'info');
      }

      if (activeVpsUrl) {
        connectToVps(activeVpsUrl, activeApiKey, activeDeviceId);
      }
    };

    loadSavedConfigAndConnect();
    requestStoragePermission(addLog, setStoragePermissionGranted);
    setIsBgActive(isBackgroundServiceRunning());
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAuth();
      addLog('Session login berhasil dihapus (Logout).', 'info');
      onLogout();
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const handleConnectToggle = async () => {
    if (connectionStatus === 'connected' || connectionStatus === 'connecting') {
      disconnectSocket();
      setConnectionStatus('disconnected');
      addLog('Koneksi WebSocket diputus.', 'info');
    } else {
      if (!vpsUrl) {
        Alert.alert('Error', 'VPS URL tidak boleh kosong');
        return;
      }
      await saveConfig(vpsUrl, apiKey);
      connectToVps(vpsUrl, apiKey, deviceId);
    }
  };

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

  return (
    <View className="flex-1 bg-slate-950" style={{ flex: 1, backgroundColor: '#090d16' }}>
      <BackgroundGlow />
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="light-content" backgroundColor="#090d16" />
        <Header subtitle="Profil & Pengaturan Node" />

        <ScrollView className="flex-1 px-4 pt-3 pb-8" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* User Profile Card */}
          <View className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-4 shadow-xl">
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-slate-800/80">
              <View className="flex-row items-center gap-3">
                {user?.picture ? (
                  <Image
                    source={{ uri: user.picture }}
                    className="w-14 h-14 rounded-2xl border border-indigo-500/40"
                  />
                ) : (
                  <View className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 items-center justify-center">
                    <Text className="text-white font-black text-xl">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Text>
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-white font-extrabold text-base">{user?.name || 'Pengguna'}</Text>
                  <Text className="text-slate-400 text-xs mt-0.5">{user?.email || 'email@google.com'}</Text>
                  <View className="flex-row items-center gap-1.5 mt-2">
                    <ShieldCheck color="#34D399" size={13} />
                    <Text className="text-[11px] font-semibold text-emerald-400">Terverifikasi Google</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogout}
              className="bg-rose-500/10 border border-rose-500/30 py-3 px-4 rounded-xl flex-row items-center justify-center gap-2"
            >
              <LogOut color="#F87171" size={16} />
              <Text className="text-rose-400 font-bold text-xs">Keluar Dari Akun (Logout)</Text>
            </TouchableOpacity>
          </View>

          {/* Section: Connection & Services Controls */}
          <ControlCard
            connectionStatus={connectionStatus}
            isBgActive={isBgActive}
            onConnectToggle={handleConnectToggle}
            onBgServiceToggle={handleBgServiceToggle}
          />

          {/* Section: Storage Permissions */}
          <PermissionCard
            storagePermissionGranted={storagePermissionGranted}
            onRequestPermission={() => requestStoragePermission(addLog, setStoragePermissionGranted)}
          />

          {/* Section: Server & VPS Configuration */}
          <ConfigCard
            vpsUrl={vpsUrl}
            setVpsUrl={setVpsUrl}
            apiKey={apiKey}
            setApiKey={setApiKey}
            deviceId={deviceId}
            setDeviceId={setDeviceId}
          />

          {/* Section: Console Logs */}
          <ConsoleLog logs={logs} />

          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
