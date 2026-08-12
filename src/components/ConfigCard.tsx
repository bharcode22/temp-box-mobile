import React from 'react';
import { View, Text, TextInput } from 'react-native';

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
    <View className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 mb-4 shadow-lg">
      <Text className="text-base font-bold text-slate-50 mb-3">VPS Configuration</Text>

      <Text className="text-xs font-semibold text-indigo-400 mb-1.5">Server VPS URL</Text>
      <TextInput
        className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs mb-3"
        value={vpsUrl}
        onChangeText={setVpsUrl}
        placeholder="http://your-vps-ip:3000"
        placeholderTextColor="#64748B"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text className="text-xs font-semibold text-indigo-400 mb-1.5">API Auth Key</Text>
      <TextInput
        className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs mb-3"
        value={apiKey}
        onChangeText={setApiKey}
        placeholder="API Key"
        placeholderTextColor="#64748B"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text className="text-xs font-semibold text-indigo-400 mb-1.5">Device ID</Text>
      <TextInput
        className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs mb-3"
        value={deviceId}
        onChangeText={setDeviceId}
        placeholder="E.g. android-hp-01"
        placeholderTextColor="#64748B"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

