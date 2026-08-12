import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';

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
    <View className="flex-1 my-2">
      <Text className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wider">
        Activity Log (Real-time)
      </Text>
      <View className="bg-slate-950 border border-slate-800 rounded-xl h-48 p-3">
        {logs.length === 0 ? (
          <Text className="text-slate-500 text-xs italic text-center mt-16">
            Belum ada aktifitas log. Sambungkan ke VPS.
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
                  className={`text-xs mb-1 leading-4 ${textColorClass}`}
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

