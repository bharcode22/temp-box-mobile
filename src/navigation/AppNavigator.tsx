import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Settings, Gamepad2, Trophy, BookOpen } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsScreen } from '../screens/SettingsScreen';
import { GameScreen } from '../screens/GameScreen';
import { LevelSelectorScreen } from '../screens/LevelSelectorScreen';
import { RulesScreen } from '../screens/RulesScreen';

export type RootTabParamList = {
  Game: undefined;
  Levels: undefined;
  Rules: undefined;
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
        tabBarActiveTintColor: '#FF5E97',
        tabBarInactiveTintColor: '#FFF385',
        tabBarStyle: {
          backgroundColor: '#4A1542',
          borderTopColor: '#FF5E97',
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
          } else if (route.name === 'Levels') {
            return <Trophy color={color} size={iconSize} />;
          } else if (route.name === 'Rules') {
            return <BookOpen color={color} size={iconSize} />;
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
        name="Levels"
        component={LevelSelectorScreen}
        options={{ tabBarLabel: 'Levels' }}
      />
      <Tab.Screen
        name="Rules"
        component={RulesScreen}
        options={{ tabBarLabel: 'Rules' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

