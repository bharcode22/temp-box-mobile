import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, Sparkles, LogIn, Lock, HardDrive, Cpu } from 'lucide-react-native';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { GradientText } from '../components/GradientText';
import { signInWithGoogle, UserProfile } from '../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const session = await signInWithGoogle();
      onLoginSuccess(session.user);
    } catch (err: any) {
      console.error('Login error:', err);
      Alert.alert('Gagal Login Google', err.message || 'Terjadi kesalahan saat verifikasi login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-950" style={{ flex: 1, backgroundColor: '#090d16' }}>
      <BackgroundGlow />
      <SafeAreaView className="flex-1 justify-between px-5 py-6">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          {/* Header Branding */}
          <View className="items-center py-6">
            <View className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 items-center justify-center mb-4 shadow-lg">
              <Lock color="#818CF8" size={32} />
            </View>

            <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-3">
              <Sparkles color="#818CF8" size={14} />
              <Text className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                Private Box Cloud Node
              </Text>
            </View>

            <GradientText text="Private Box Mobile" fontSize={30} />

            <Text className="text-slate-400 text-sm text-center leading-relaxed mt-3 max-w-xs">
              Masuk untuk mengakses berkas privat, mengelola remote node, dan sinkronisasi otomatis dari perangkat Anda.
            </Text>
          </View>

          {/* Feature Highlights */}
          <View className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 my-4 space-y-3">
            <View className="flex-row items-center gap-3">
              <View className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <HardDrive color="#818CF8" size={18} />
              </View>
              <View className="flex-1">
                <Text className="text-white text-xs font-bold">Penyimpanan Terenkripsi</Text>
                <Text className="text-slate-400 text-[11px]">Akses dan sinkronisasi berkas secara privat</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3 pt-2 border-t border-slate-800/60">
              <View className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Cpu color="#818CF8" size={18} />
              </View>
              <View className="flex-1">
                <Text className="text-white text-xs font-bold">Remote Agent Automatic</Text>
                <Text className="text-slate-400 text-[11px]">Koneksi WebSocket & background service otomatis</Text>
              </View>
            </View>
          </View>

          {/* Login Button */}
          <View className="mt-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGoogleLogin}
              disabled={loading}
              className="bg-indigo-600 active:bg-indigo-700 py-4 px-6 rounded-2xl flex-row items-center justify-center gap-3 shadow-lg border border-indigo-400/30"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <LogIn color="#FFFFFF" size={20} />
                  <Text className="text-white font-bold text-base">Masuk dengan Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="items-center py-2">
          <Text className="text-slate-500 text-[11px]">
            &copy; 2026 Private Box. End-to-End Encrypted Cloud.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};
