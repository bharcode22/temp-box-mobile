import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ShieldCheck, FolderKey } from 'lucide-react-native';

interface PermissionCardProps {
  storagePermissionGranted: boolean;
  onRequestPermission: () => void;
}

export const PermissionCard: React.FC<PermissionCardProps> = ({
  storagePermissionGranted,
  onRequestPermission,
}) => {
  return (
    <View className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-4 shadow-xl">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center">
            <FolderKey color="#818CF8" size={18} />
          </View>
          <View>
            <Text className="text-base font-bold text-slate-50">Storage Access</Text>
            <Text className="text-[11px] text-slate-400">Android Internal Memory</Text>
          </View>
        </View>

        <View
          className={`px-3 py-1 rounded-full border ${
            storagePermissionGranted
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              storagePermissionGranted ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {storagePermissionGranted ? 'Granted' : 'Required'}
          </Text>
        </View>
      </View>

      <Text className="text-xs text-slate-400 leading-relaxed mb-3">
        Izin ini dibutuhkan agar VPS backend dapat membaca berkas di memori perangkat (seperti DCIM atau Download) untuk sinking otomatis.
      </Text>

      {!storagePermissionGranted && (
        <TouchableOpacity
          className="bg-indigo-600 active:bg-indigo-700 rounded-xl py-3 items-center justify-center mt-1 border border-indigo-500/30 shadow-lg shadow-indigo-600/20"
          onPress={onRequestPermission}
        >
          <View className="flex-row items-center gap-2">
            <ShieldCheck color="#FFFFFF" size={16} />
            <Text className="text-white text-xs font-bold">Beri Izin Akses File</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

