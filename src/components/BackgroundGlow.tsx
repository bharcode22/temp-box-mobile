import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

export const BackgroundGlow: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="topIndigoGlow"
            cx="10%"
            cy="10%"
            rx="50%"
            ry="40%"
            fx="10%"
            fy="10%"
          >
            <Stop offset="0%" stopColor="#4F46E5" stopOpacity="0.28" />
            <Stop offset="50%" stopColor="#4F46E5" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="#090d16" stopOpacity="0" />
          </RadialGradient>

          <RadialGradient
            id="centerPurpleGlow"
            cx="90%"
            cy="45%"
            rx="55%"
            ry="45%"
            fx="90%"
            fy="45%"
          >
            <Stop offset="0%" stopColor="#7C3AED" stopOpacity="0.22" />
            <Stop offset="50%" stopColor="#7C3AED" stopOpacity="0.06" />
            <Stop offset="100%" stopColor="#090d16" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#topIndigoGlow)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#centerPurpleGlow)" />
      </Svg>
    </View>
  );
};

