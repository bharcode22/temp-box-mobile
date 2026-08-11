import React from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { Header } from '../components/Header';
import { GradientText } from '../components/GradientText';
import { BackgroundGlow } from '../components/BackgroundGlow';

export const GameScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-slate-950" style={{ flex: 1, backgroundColor: '#090d16' }}>
      <BackgroundGlow />
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="light-content" backgroundColor="#090d16" />
        <Header subtitle="Temporary Box" />

        <View className="flex-1 justify-center items-center p-5">
          <View className="bg-slate-900/70 border border-white/10 rounded-2xl px-8 py-6 items-center justify-center shadow-2xl shadow-indigo-500/20">
            <GradientText text="Hallo World" fontSize={32} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
