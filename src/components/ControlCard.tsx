import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface ControlCardProps {
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  isBgActive: boolean;
  onConnectToggle: () => void;
  onBgServiceToggle: () => void;
}

export const ControlCard: React.FC<ControlCardProps> = ({
  connectionStatus,
  isBgActive,
  onConnectToggle,
  onBgServiceToggle,
}) => {
  const getStatusDotBg = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-emerald-400';
      case 'connecting': return 'bg-indigo-400';
      case 'error': return 'bg-red-400';
      default: return 'bg-slate-400';
    }
  };

  const getStatusTextColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-emerald-400';
      case 'connecting': return 'text-indigo-400';
      case 'error': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'ONLINE';
      case 'connecting': return 'CONNECTING...';
      case 'error': return 'CONN ERROR';
      default: return 'OFFLINE';
    }
  };

  return (
    <View className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 mb-4 shadow-lg">
      <Text className="text-base font-bold text-slate-50 mb-3">Controls</Text>

      <View className="flex-row items-center mb-3">
        <Text className="text-xs font-semibold text-slate-400 mr-2">WebSocket Status:</Text>
        <View className={`w-2.5 h-2.5 rounded-full mr-2 ${getStatusDotBg()}`} />
        <Text className={`text-xs font-bold ${getStatusTextColor()}`}>{getStatusText()}</Text>
      </View>

      <TouchableOpacity
        className={`rounded-xl py-3 items-center justify-center mt-1 border ${
          connectionStatus === 'connected'
            ? 'bg-red-600/80 active:bg-red-700 border-red-500/30'
            : 'bg-indigo-600 active:bg-indigo-700 border-indigo-500/30 shadow-lg shadow-indigo-600/20'
        }`}
        onPress={onConnectToggle}
        disabled={connectionStatus === 'connecting'}
      >
        {connectionStatus === 'connecting' ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text className="text-white text-sm font-bold">
            {connectionStatus === 'connected' ? 'Putuskan Sambungan' : 'Hubungkan ke VPS'}
          </Text>
        )}
      </TouchableOpacity>

      <View className="h-[1px] bg-slate-800/80 my-4" />

      <View className="flex-row items-center mb-3">
        <Text className="text-xs font-semibold text-slate-400 mr-2">Persistent Service:</Text>
        <Text className={`text-xs font-bold ${isBgActive ? 'text-emerald-400' : 'text-slate-400'}`}>
          {isBgActive ? 'AKTIF (Foreground)' : 'NON-AKTIF'}
        </Text>
      </View>

      <TouchableOpacity
        className={`rounded-xl py-3 items-center justify-center mt-1 border ${
          isBgActive
            ? 'bg-slate-800 active:bg-slate-700 border-slate-700/50'
            : 'bg-indigo-600 active:bg-indigo-700 border-indigo-500/30 shadow-lg shadow-indigo-600/20'
        }`}
        onPress={onBgServiceToggle}
      >
        <Text className="text-white text-sm font-bold">
          {isBgActive ? 'Matikan Background Service' : 'Aktifkan Background Service'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

