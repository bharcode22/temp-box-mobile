import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Sliders, Wifi, Activity, Power } from 'lucide-react-native';

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
    <View className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-4 shadow-xl">
      <View className="flex-row items-center gap-2.5 mb-4">
        <View className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center">
          <Sliders color="#818CF8" size={18} />
        </View>
        <View>
          <Text className="text-base font-bold text-slate-50">Connection & Services</Text>
          <Text className="text-[11px] text-slate-400">Status WebSocket & Foreground Process</Text>
        </View>
      </View>

      {/* WebSocket Status Row */}
      <View className="flex-row items-center justify-between mb-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <View className="flex-row items-center gap-2">
          <Wifi color="#818CF8" size={16} />
          <Text className="text-xs font-semibold text-slate-300">WebSocket VPS Status:</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className={`w-2.5 h-2.5 rounded-full ${getStatusDotBg()}`} />
          <Text className={`text-xs font-bold ${getStatusTextColor()}`}>{getStatusText()}</Text>
        </View>
      </View>

      <TouchableOpacity
        className={`rounded-xl py-3 items-center justify-center mb-4 border ${
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
          <View className="flex-row items-center gap-2">
            <Power color="#FFFFFF" size={16} />
            <Text className="text-white text-xs font-bold">
              {connectionStatus === 'connected' ? 'Putuskan Sambungan WebSocket' : 'Hubungkan ke VPS Server'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View className="h-[1px] bg-slate-800/80 my-2" />

      {/* Persistent Service Status Row */}
      <View className="flex-row items-center justify-between my-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <View className="flex-row items-center gap-2">
          <Activity color="#818CF8" size={16} />
          <Text className="text-xs font-semibold text-slate-300">Foreground Service:</Text>
        </View>
        <Text className={`text-xs font-bold ${isBgActive ? 'text-emerald-400' : 'text-slate-400'}`}>
          {isBgActive ? 'AKTIF (Foreground)' : 'NON-AKTIF'}
        </Text>
      </View>

      <TouchableOpacity
        className={`rounded-xl py-3 items-center justify-center border ${
          isBgActive
            ? 'bg-slate-800 active:bg-slate-700 border-slate-700/50'
            : 'bg-indigo-600 active:bg-indigo-700 border-indigo-500/30 shadow-lg shadow-indigo-600/20'
        }`}
        onPress={onBgServiceToggle}
      >
        <View className="flex-row items-center gap-2">
          <Activity color="#FFFFFF" size={16} />
          <Text className="text-white text-xs font-bold">
            {isBgActive ? 'Matikan Background Service' : 'Aktifkan Background Service'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};


