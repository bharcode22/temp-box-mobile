import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  badgeText?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  Icon,
  badgeText,
}) => {
  return (
    <View className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 mb-4 shadow-lg">
      <View className="flex-row items-center justify-between mb-3">
        <View className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center">
          <Icon color="#818CF8" size={20} />
        </View>
        {badgeText && (
          <View className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
            <Text className="text-[11px] font-semibold text-indigo-300">{badgeText}</Text>
          </View>
        )}
      </View>
      <Text className="text-base font-bold text-slate-50 mb-1">{title}</Text>
      <Text className="text-xs text-slate-400 leading-relaxed">{description}</Text>
    </View>
  );
};
