import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Globe, Key, Smartphone, Server } from 'lucide-react-native';

interface ConfigCardProps {
  vpsUrl: string;
  setVpsUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  deviceId: string;
  setDeviceId: (id: string) => void;
}

export const ConfigCard: React.FC<ConfigCardProps> = ({
  vpsUrl,
  setVpsUrl,
  apiKey,
  setApiKey,
  deviceId,
  setDeviceId,
}) => {
  return (
    <View className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-4 shadow-xl">
      <View className="flex-row items-center gap-2.5 mb-4">
        <View className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center">
          <Server color="#818CF8" size={18} />
        </View>
        <View>
          <Text className="text-base font-bold text-slate-50">VPS Server Config</Text>
          <Text className="text-[11px] text-slate-400">Pengaturan Alamat & Autentikasi</Text>
        </View>
      </View>

      {/* VPS URL Field */}
      <View className="mb-3">
        <View className="flex-row items-center gap-1.5 mb-1.5">
          <Globe color="#818CF8" size={14} />
          <Text className="text-xs font-semibold text-indigo-300">Server VPS URL</Text>
        </View>
        <TextInput
          className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs focus:border-indigo-500"
          value={vpsUrl}
          onChangeText={setVpsUrl}
          placeholder="http://182.xxx.xxx.xxx:3000 atau https://..."
          placeholderTextColor="#64748B"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* API Key Field */}
      <View className="mb-3">
        <View className="flex-row items-center gap-1.5 mb-1.5">
          <Key color="#818CF8" size={14} />
          <Text className="text-xs font-semibold text-indigo-300">API Auth Key</Text>
        </View>
        <TextInput
          className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs focus:border-indigo-500"
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Super-secret-key..."
          placeholderTextColor="#64748B"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Device ID Field */}
      <View className="mb-1">
        <View className="flex-row items-center gap-1.5 mb-1.5">
          <Smartphone color="#818CF8" size={14} />
          <Text className="text-xs font-semibold text-indigo-300">Device Identifier (ID)</Text>
        </View>
        <TextInput
          className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs focus:border-indigo-500"
          value={deviceId}
          onChangeText={setDeviceId}
          placeholder="Terdeteksi otomatis (e.g. samsung-SM-X205)"
          placeholderTextColor="#64748B"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};


