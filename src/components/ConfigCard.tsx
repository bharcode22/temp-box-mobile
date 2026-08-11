import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '../styles/App.styles';

interface ConfigCardProps {
  vpsUrl: string;
  setVpsUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  deviceId: string;
  setDeviceId: (id: string) => void;
}

export const ConfigCard: React.FC<ConfigCardProps> = ({
  vpsUrl,
  setVpsUrl,
  apiKey,
  setApiKey,
  deviceId,
  setDeviceId,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>VPS Configuration</Text>

      <Text style={styles.inputLabel}>Server VPS URL</Text>
      <TextInput
        style={styles.input}
        value={vpsUrl}
        onChangeText={setVpsUrl}
        placeholder="http://your-vps-ip:3000"
        placeholderTextColor="#64748B"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.inputLabel}>API Auth Key</Text>
      <TextInput
        style={styles.input}
        value={apiKey}
        onChangeText={setApiKey}
        placeholder="API Key"
        placeholderTextColor="#64748B"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.inputLabel}>Device ID</Text>
      <TextInput
        style={styles.input}
        value={deviceId}
        onChangeText={setDeviceId}
        placeholder="E.g. android-hp-01"
        placeholderTextColor="#64748B"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};
