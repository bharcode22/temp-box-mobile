import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Clock, Sparkles } from 'lucide-react-native';
import { Header } from '../components/Header';
import { BackgroundGlow } from '../components/BackgroundGlow';

export const ActivityScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-slate-950" style={{ flex: 1, backgroundColor: '#090d16' }}>
      <BackgroundGlow />
      <SafeAreaView className="flex-1">
        <Header subtitle="Riwayat Aktivitas" />

        <ScrollView className="flex-1 px-4 pt-3 pb-8" showsVerticalScrollIndicator={false}>
          {/* Section Header */}
          <View className="flex-row items-center gap-2 mb-4">
            <View className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
              <Activity color="#818CF8" size={20} />
            </View>
            <View>
              <Text className="text-white font-extrabold text-lg">Aktivitas</Text>
              <Text className="text-slate-400 text-xs">Log & riwayat sinkronisasi remote node</Text>
            </View>
          </View>

          {/* Hello World Card */}
          <View className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl items-center justify-center min-h-[220px]">
            <View className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center mb-3">
              <Clock color="#818CF8" size={28} />
            </View>
            <Text className="text-white text-2xl font-black tracking-wide text-center">
              Hello World
            </Text>
            <Text className="text-slate-400 text-xs text-center mt-2 leading-relaxed max-w-xs">
              Modul pemantauan aktivitas node Anda siap dikembangkan.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
