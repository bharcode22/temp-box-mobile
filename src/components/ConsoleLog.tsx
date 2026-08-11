import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from '../styles/App.styles';

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
    <View style={{ flex: 1 }}>
      <Text style={styles.sectionHeader}>Activity Log (Real-time)</Text>
      <View style={styles.consoleContainer}>
        {logs.length === 0 ? (
          <Text style={styles.emptyLogsText}>Belum ada aktifitas log. Sambungkan ke VPS.</Text>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.consoleScroll}
            nestedScrollEnabled={true}
          >
            {logs.map((log, index) => {
              let color = '#E2E8F0'; // Default slate 200
              if (log.type === 'success') color = '#34D399'; // Green
              if (log.type === 'warn') color = '#FBBF24'; // Amber
              if (log.type === 'error') color = '#F87171'; // Red

              return (
                <Text key={index} style={[styles.consoleText, { color }]}>
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
