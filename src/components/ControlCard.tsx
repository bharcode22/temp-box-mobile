import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from '../styles/App.styles';

interface ControlCardProps {
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  isBgActive: boolean;
  onConnectToggle: () => void;
  onBgServiceToggle: () => void;
}

export const ControlCard: React.FC<ControlCardProps> = ({
  connectionStatus,
  isBgActive,
  onConnectToggle,
  onBgServiceToggle,
}) => {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#EAE0CF'; // Warm Cream
      case 'connecting': return '#7288AE'; // Muted Blue
      case 'error': return '#EF4444'; // Red
      default: return '#7288AE'; // Muted Blue
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'ONLINE';
      case 'connecting': return 'CONNECTING...';
      case 'error': return 'CONN ERROR';
      default: return 'OFFLINE';
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Controls</Text>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>WebSocket Status:</Text>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusVal, { color: getStatusColor() }]}>{getStatusText()}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: connectionStatus === 'connected' ? '#EF4444' : '#7288AE' }
        ]}
        onPress={onConnectToggle}
        disabled={connectionStatus === 'connecting'}
      >
        {connectionStatus === 'connecting' ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>
            {connectionStatus === 'connected' ? 'Putuskan Sambungan' : 'Hubungkan ke VPS'}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Persistent Service:</Text>
        <Text style={[styles.statusVal, { color: isBgActive ? '#EAE0CF' : '#7288AE' }]}>
          {isBgActive ? 'AKTIF (Foreground)' : 'NON-AKTIF'}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: isBgActive ? '#111844' : '#7288AE' }
        ]}
        onPress={onBgServiceToggle}
      >
        <Text style={styles.buttonText}>
          {isBgActive ? 'Matikan Background Service' : 'Aktifkan Background Service'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
