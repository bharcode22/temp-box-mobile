import React, { useState, useEffect } from 'react';
import { View, ScrollView, StatusBar, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, HardDrive, ShieldCheck, Smartphone, Activity, Server, Cpu } from 'lucide-react-native';

// Components
import { Header } from '../components/Header';
import { GradientText } from '../components/GradientText';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { FeatureCard } from '../components/FeatureCard';
import { AuthCard } from '../components/AuthCard';

// Services & Config
import { isConnected } from '../services/socketService';
import { isBackgroundServiceRunning } from '../services/backgroundService';
import { loadSavedAuth, signInWithGoogle, logoutAuth, UserProfile } from '../services/authService';
import { DEFAULT_VPS_URL } from '../config';

export const GameScreen: React.FC = () => {
  const [socketOnline, setSocketOnline] = useState(false);
  const [bgActive, setBgActive] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await loadSavedAuth();
        if (session) {
          setUser(session.user);
        }
      } catch (_) {}
      setAuthLoading(false);
    };

    checkAuth();

    const interval = setInterval(() => {
      setSocketOnline(isConnected());
      setBgActive(isBackgroundServiceRunning());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      const session = await signInWithGoogle();
      setUser(session.user);
    } catch (err: any) {
      console.error('Login error:', err);
      Alert.alert('Gagal Login Google', err.message || 'Terjadi kesalahan saat verifikasi login.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAuth();
      setUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  return (
    <View className="flex-1 bg-slate-950" style={{ flex: 1, backgroundColor: '#090d16' }}>
      <BackgroundGlow />
      <SafeAreaView className="flex-1">
        <Header subtitle="Dashboard Node" />

        <ScrollView className="flex-1 px-4 pt-3 pb-8" showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View className="items-center py-5">
            <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-3">
              <Sparkles color="#818CF8" size={14} />
              <Text className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                Multi-Drive SaaS Remote Node
              </Text>
            </View>

            <GradientText text="Temporary Box Node" fontSize={26} />

            <Text className="text-slate-400 text-xs text-center leading-relaxed mt-2 px-4 max-w-md">
              Perangkat Android Anda berfungsi sebagai remote node privat terenkripsi untuk manajemen & sinkronisasi berkas.
            </Text>
          </View>

          {/* User Auth Profile / Google Login Card */}
          <AuthCard
            user={user}
            loading={authLoading}
            onLogin={handleGoogleLogin}
            onLogout={handleLogout}
          />

          {/* Node Live Status Summary */}
          <View className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-5 shadow-2xl">
            <View className="flex-row items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
              <View className="flex-row items-center gap-2">
                <Cpu color="#818CF8" size={18} />
                <Text className="text-sm font-bold text-white">Live Node Metrics</Text>
              </View>
              <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800">
                <View className={`w-2 h-2 rounded-full ${socketOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <Text className={`text-[10px] font-bold ${socketOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {socketOnline ? 'NODE ACTIVE' : 'NODE STANDBY'}
                </Text>
              </View>
            </View>

            {/* Metrics Items */}
            <View className="space-y-3">
              {/* WebSocket Status */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Activity color="#64748B" size={14} />
                  <Text className="text-xs text-slate-400">WebSocket Transport</Text>
                </View>
                <Text className={`text-xs font-bold ${socketOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {socketOnline ? 'Connected' : 'Offline / Standby'}
                </Text>
              </View>

              {/* Background Process */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Activity color="#64748B" size={14} />
                  <Text className="text-xs text-slate-400">Foreground Service</Text>
                </View>
                <Text className={`text-xs font-bold ${bgActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {bgActive ? 'Running (Persistent)' : 'Inactive'}
                </Text>
              </View>

              {/* Target VPS Host */}
              <View className="flex-row items-center justify-between pt-1">
                <View className="flex-row items-center gap-2">
                  <Server color="#64748B" size={14} />
                  <Text className="text-xs text-slate-400">Target VPS URL</Text>
                </View>
                <Text className="text-xs font-semibold text-indigo-300 max-w-[180px]" numberOfLines={1}>
                  {DEFAULT_VPS_URL || 'Configured via .env'}
                </Text>
              </View>
            </View>
          </View>

          {/* Section Divider Header */}
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
            Fitur Utama Remote Node
          </Text>

          {/* Feature Showcase Cards */}
          <FeatureCard
            title="Direct Cloud Storage Sync"
            description="Sistem terintegrasi secara aman dengan VPS backend untuk akses dan streaming berkas berkecepatan tinggi."
            Icon={HardDrive}
            badgeText="Fast Stream"
          />

          <FeatureCard
            title="Bagi File Via Kode Unik"
            description="Mendukung kompresi gambar & streaming berkas privat dari HP berbasis enkripsi token & session ID unik."
            Icon={ShieldCheck}
            badgeText="Encrypted"
          />

          <FeatureCard
            title="Android Remote Agent"
            description="Layanan latar belakang persistent menjaga koneksi WebSocket tetap hidup tanpa dimatikan oleh OS Android."
            Icon={Smartphone}
            badgeText="Persistent"
          />

          <View className="h-6" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

