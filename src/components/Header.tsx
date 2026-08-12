import React from 'react';
import { View, Text } from 'react-native';
import { HardDrive, Sparkles } from 'lucide-react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ subtitle }) => {
  return (
    <View className="flex-row items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800/80">
      <View className="flex-row items-center">
        <View className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 items-center justify-center mr-3 shadow-lg shadow-indigo-500/30">
          <HardDrive color="#FFFFFF" size={18} />
        </View>
        <View className="flex-row items-center">
          <Text className="text-lg font-extrabold text-white tracking-tight">Temporary</Text>
          <Text className="text-lg font-extrabold text-indigo-400 tracking-tight">Box</Text>
        </View>
      </View>
      
      <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
        <Sparkles color="#818CF8" size={12} />
        <Text className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
          {subtitle || 'SaaS Storage'}
        </Text>
      </View>
    </View>
  );
};

