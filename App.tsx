import React, { useEffect } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initializeAppAtStartup } from './src/services/startupService';

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#090d16',
    card: '#0F172A',
    border: 'rgba(255, 255, 255, 0.08)',
  },
};

function App() {
  useEffect(() => {
    initializeAppAtStartup();
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#090d16' }}>
      <NavigationContainer theme={customDarkTheme}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

