import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Folder, Activity, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FilesScreen } from '../screens/FilesScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { UserProfile } from '../services/authService';

export type RootTabParamList = {
  Files: undefined;
  Activity: undefined;
  Account: undefined;
};

interface AppNavigatorProps {
  user: UserProfile | null;
  onLogout: () => void;
}

const Tab = createBottomTabNavigator<RootTabParamList>();

export const AppNavigator: React.FC<AppNavigatorProps> = ({ user, onLogout }) => {
  const insets = useSafeAreaInsets();
  const TAB_BAR_INNER_HEIGHT = 56;
  const tabBarHeight = TAB_BAR_INNER_HEIGHT + insets.bottom;

  return (
    <Tab.Navigator
      initialRouteName="Files"
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: '#090d16' },
        tabBarActiveTintColor: '#818cf8',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#090d16',
          borderTopColor: 'rgba(30, 41, 59, 0.8)',
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: insets.bottom + 4,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size }) => {
          const iconSize = size - 2;
          if (route.name === 'Files') {
            return <Folder color={color} size={iconSize} />;
          } else if (route.name === 'Activity') {
            return <Activity color={color} size={iconSize} />;
          } else if (route.name === 'Account') {
            return <User color={color} size={iconSize} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen
        name="Files"
        component={FilesScreen}
        options={{ tabBarLabel: 'File Saya' }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ tabBarLabel: 'Aktivitas' }}
      />
      <Tab.Screen
        name="Account"
        options={{ tabBarLabel: 'Akun Saya' }}
      >
        {() => <AccountScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
