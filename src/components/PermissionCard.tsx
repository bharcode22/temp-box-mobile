import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/App.styles';

interface PermissionCardProps {
  storagePermissionGranted: boolean;
  onRequestPermission: () => void;
}

export const PermissionCard: React.FC<PermissionCardProps> = ({
  storagePermissionGranted,
  onRequestPermission,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.permissionHeader}>
        <Text style={styles.cardTitle}>Android Storage Access</Text>
        <View style={[
          styles.badge,
          { backgroundColor: storagePermissionGranted ? '#065F46' : '#991B1B' }
        ]}>
          <Text style={styles.badgeText}>
            {storagePermissionGranted ? 'Granted' : 'Required'}
          </Text>
        </View>
      </View>

      <Text style={styles.cardDescription}>
        Izin ini dibutuhkan agar VPS Anda bisa membaca berkas di memori eksternal (seperti DCIM atau Download).
      </Text>

      {!storagePermissionGranted && (
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={onRequestPermission}
        >
          <Text style={styles.buttonText}>Beri Izin Akses File</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
