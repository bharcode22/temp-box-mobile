import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/App.styles';
import { LucideIcon } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  subtitle: string;
  Icon?: LucideIcon;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, Icon }) => {
  return (
    <View style={[styles.header, { flexDirection: 'row', alignItems: 'center' }]}>
      {Icon && <Icon color="#FFEBF3" size={24} style={{ marginRight: 12 }} />}
      <View>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};
