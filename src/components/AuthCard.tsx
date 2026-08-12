import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { User, LogIn, LogOut, ShieldCheck, Sparkles } from 'lucide-react-native';
import { UserProfile } from '../services/authService';

interface AuthCardProps {
  user: UserProfile | null;
  loading: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  user,
  loading,
  onLogin,
  onLogout,
}) => {
  if (loading) {
    return (
      <View className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-4 shadow-xl items-center justify-center py-8">
        <ActivityIndicator color="#818CF8" size="small" />
        <Text className="text-xs text-slate-400 mt-2">Memeriksa status autentikasi...</Text>
      </View>
    );
  }

  if (user) {
    return (
      <View className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-4 shadow-xl">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            {user.picture ? (
              <Image
                source={{ uri: user.picture }}
                className="w-11 h-11 rounded-xl border border-indigo-500/30"
              />
            ) : (
              <View className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 items-center justify-center shadow-md">
                <Text className="text-white font-extrabold text-base">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}

            <View className="flex-1 max-w-[200px]">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-sm font-bold text-white truncate" numberOfLines={1}>
                  {user.name || 'Pengguna Mobile'}
                </Text>
                <ShieldCheck color="#34D399" size={14} />
              </View>
              <Text className="text-xs text-slate-400 truncate" numberOfLines={1}>
                {user.email}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 active:bg-red-500/20"
            onPress={onLogout}
          >
            <LogOut color="#F87171" size={18} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-4 shadow-xl">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center">
            <User color="#818CF8" size={18} />
          </View>
          <View>
            <Text className="text-base font-bold text-slate-50">Akun Private Box</Text>
            <Text className="text-[11px] text-slate-400">Google OAuth 2.0 Single Sign-On</Text>
          </View>
        </View>

        <View className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex-row items-center gap-1">
          <Sparkles color="#818CF8" size={10} />
          <Text className="text-[10px] font-bold text-indigo-300">20 GB Cloud</Text>
        </View>
      </View>

      <Text className="text-xs text-slate-400 leading-relaxed mb-3">
        Masuk menggunakan akun Google yang sama dengan Web App untuk sinkronisasi kuota dan pembagian berkas.
      </Text>

      <TouchableOpacity
        className="bg-indigo-600 active:bg-indigo-700 rounded-xl py-3 items-center justify-center border border-indigo-500/30 shadow-lg shadow-indigo-600/20"
        onPress={onLogin}
      >
        <View className="flex-row items-center gap-2">
          <LogIn color="#FFFFFF" size={16} />
          <Text className="text-white text-xs font-bold">Masuk dengan Google</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
