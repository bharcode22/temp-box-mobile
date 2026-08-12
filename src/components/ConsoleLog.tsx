import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { Terminal } from 'lucide-react-native';

interface AppLog {
  time: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

interface ConsoleLogProps {
  logs: AppLog[];
}

export const ConsoleLog: React.FC<ConsoleLogProps> = ({ logs }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to end on new log
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [logs]);

  return (
    <View className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-4 shadow-xl">
      <View className="flex-row items-center gap-2.5 mb-3">
        <View className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center">
          <Terminal color="#818CF8" size={18} />
        </View>
        <View>
          <Text className="text-base font-bold text-slate-50">Real-time Activity Log</Text>
          <Text className="text-[11px] text-slate-400">Jejak Event Socket & Service</Text>
        </View>
      </View>

      <View className="bg-slate-950 border border-slate-800/90 rounded-xl h-48 p-3.5">
        {logs.length === 0 ? (
          <Text className="text-slate-500 text-xs italic text-center mt-16">
            Belum ada aktivitas log. Hubungkan ke VPS Server.
          </Text>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            nestedScrollEnabled={true}
          >
            {logs.map((log, index) => {
              let textColorClass = 'text-slate-300';
              if (log.type === 'success') textColorClass = 'text-emerald-400';
              if (log.type === 'warn') textColorClass = 'text-amber-400';
              if (log.type === 'error') textColorClass = 'text-red-400';

              return (
                <Text
                  key={index}
                  className={`text-[11px] mb-1 leading-4 ${textColorClass}`}
                  style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' }}
                >
                  [{log.time}] {log.message}
                </Text>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};


