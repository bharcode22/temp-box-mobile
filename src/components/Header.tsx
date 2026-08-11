import React from 'react';
import { View, Text } from 'react-native';
import { HardDrive } from 'lucide-react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ subtitle }) => {
  return (
    <View className="flex-row items-center justify-between px-5 py-4 bg-slate-950/90 border-b border-white/10">
      <View className="flex-row items-center">
        <View className="w-8 h-8 rounded-xl bg-indigo-600 items-center justify-center mr-2.5 shadow-lg shadow-indigo-500/30">
          <HardDrive color="#FFFFFF" size={18} />
        </View>
        <View className="flex-row items-center">
          <Text className="text-lg font-extrabold text-slate-50 tracking-tight">Temporary</Text>
          <Text className="text-lg font-extrabold text-indigo-400 tracking-tight">Box</Text>
        </View>
      </View>
      <View className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
        <Text className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
          {subtitle || 'SaaS Storage'}
        </Text>
      </View>
    </View>
  );
};
