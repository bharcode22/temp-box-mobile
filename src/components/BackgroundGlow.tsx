import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const BackgroundGlow: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top Left Indigo Glow Accent */}
      <View
        style={[
          styles.glow,
          {
            top: -90,
            left: -90,
            width: width * 0.75,
            height: width * 0.75,
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
          },
        ]}
      />
      {/* Center-Right Purple Glow Accent */}
      <View
        style={[
          styles.glow,
          {
            top: '35%',
            right: -100,
            width: width * 0.8,
            height: width * 0.8,
            backgroundColor: 'rgba(168, 85, 247, 0.14)',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    borderRadius: 9999,
  },
});
