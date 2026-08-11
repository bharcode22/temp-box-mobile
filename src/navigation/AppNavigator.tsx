import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Settings, Gamepad2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsScreen } from '../screens/SettingsScreen';
import { GameScreen } from '../screens/GameScreen';

export type RootTabParamList = {
  Game: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export const AppNavigator: React.FC = () => {
  // Ambil inset bawah untuk menghindari tertimpa gesture nav bar Android
  const insets = useSafeAreaInsets();
  const TAB_BAR_INNER_HEIGHT = 56; // Tinggi konten tab bar (ikon + label)
  const tabBarHeight = TAB_BAR_INNER_HEIGHT + insets.bottom;

  return (
    <Tab.Navigator
      initialRouteName="Game"
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: '#090d16' },
        tabBarActiveTintColor: '#818cf8',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#090d16',
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          borderTopWidth: 1,
          // Tinggi total = konten + safe area bottom (gesture nav bar)
          height: tabBarHeight,
          paddingBottom: insets.bottom + 4,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          const iconSize = size - 2;
          if (route.name === 'Game') {
            return <Gamepad2 color={color} size={iconSize} />;
          } else if (route.name === 'Settings') {
            return <Settings color={color} size={iconSize} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen
        name="Game"
        component={GameScreen}
        options={{ tabBarLabel: 'Play' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

