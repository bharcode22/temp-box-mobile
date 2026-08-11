import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface GradientButtonProps {
  onPress: () => void;
  title: string;
  Icon?: React.ComponentType<{ color?: string; size?: number; style?: any }>;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  colors?: [string, string];
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  onPress,
  title,
  Icon,
  disabled = false,
  style,
  textStyle,
  colors = ['#4F46E5', '#7C3AED'],
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[styles.buttonContainer, disabled && { opacity: 0.6 }, style]}
    >
      <Svg style={StyleSheet.absoluteFill} height="100%" width="100%">
        <Defs>
          <LinearGradient id="btnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors[0]} />
            <Stop offset="100%" stopColor={colors[1]} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx={8} fill="url(#btnGradient)" />
      </Svg>

      {Icon && <Icon color="#FFFFFF" size={16} style={{ marginRight: 8 }} />}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
