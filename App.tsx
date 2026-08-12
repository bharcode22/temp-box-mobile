import './global.css';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LoginScreen } from './src/screens/LoginScreen';
import { initializeAppAtStartup } from './src/services/startupService';
import { loadSavedAuth, UserProfile } from './src/services/authService';

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    initializeAppAtStartup();

    const checkSavedSession = async () => {
      try {
        const session = await loadSavedAuth();
        if (session) {
          setUser(session.user);
        }
      } catch (_) {
      } finally {
        setAuthLoading(false);
      }
    };

    checkSavedSession();
  }, []);

  if (authLoading) {
    return (
      <SafeAreaProvider style={{ flex: 1, backgroundColor: '#090d16' }}>
        <View style={{ flex: 1, backgroundColor: '#090d16', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#818CF8" size="large" />
          <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 12 }}>Memuat sesi aplikasi...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#090d16' }}>
      {!user ? (
        <LoginScreen onLoginSuccess={(u) => setUser(u)} />
      ) : (
        <NavigationContainer theme={customDarkTheme}>
          <AppNavigator user={user} onLogout={() => setUser(null)} />
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}

export default App;
