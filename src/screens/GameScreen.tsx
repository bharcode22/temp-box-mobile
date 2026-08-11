import React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { Gamepad2 } from 'lucide-react-native';

export const GameScreen: React.FC = () => {
  return (
    <View style={localStyles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#2A0825" />
        <Header title="Game" subtitle="Game Screen" Icon={Gamepad2} />

        <View style={localStyles.contentContainer}>
          <View style={localStyles.card}>
            <Text style={localStyles.titleText}>Hallo World</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A0825',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#4A1542',
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF5E97',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF5E97',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFEBF3',
    textAlign: 'center',
  },
});

