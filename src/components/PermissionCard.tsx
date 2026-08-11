import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface PermissionCardProps {
  storagePermissionGranted: boolean;
  onRequestPermission: () => void;
}

export const PermissionCard: React.FC<PermissionCardProps> = ({
  storagePermissionGranted,
  onRequestPermission,
}) => {
  return (
    <View className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4 shadow-lg">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-slate-50">Android Storage Access</Text>
        <View
          className={`px-2.5 py-1 rounded-full border ${
            storagePermissionGranted
              ? 'bg-emerald-500/20 border-emerald-500/30'
              : 'bg-red-500/20 border-red-500/30'
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              storagePermissionGranted ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {storagePermissionGranted ? 'Granted' : 'Required'}
          </Text>
        </View>
      </View>

      <Text className="text-xs text-slate-400 leading-relaxed mb-3">
        Izin ini dibutuhkan agar VPS Anda bisa membaca berkas di memori eksternal (seperti DCIM atau Download).
      </Text>

      {!storagePermissionGranted && (
        <TouchableOpacity
          className="bg-indigo-600 active:bg-indigo-700 rounded-xl py-2.5 items-center justify-center mt-1"
          onPress={onRequestPermission}
        >
          <Text className="text-slate-50 text-sm font-bold">Beri Izin Akses File</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
