import React from 'react';
import { View } from 'react-native';
import Svg, { Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

interface GradientTextProps {
  text: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  height?: number;
}

export const GradientText: React.FC<GradientTextProps> = ({
  text,
  fontSize = 28,
  fontWeight = 'bold',
  height = fontSize * 1.35,
}) => {
  const gradientId = `textGradient-${text.replace(/[^a-zA-Z0-9]/g, '_')}`;

  return (
    <View style={{ height, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <Svg height={height} width="100%">
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#818cf8" />
            <Stop offset="50%" stopColor="#c084fc" />
            <Stop offset="100%" stopColor="#f472b6" />
          </LinearGradient>
        </Defs>
        <SvgText
          fill={`url(#${gradientId})`}
          fontSize={fontSize}
          fontWeight={fontWeight}
          x="50%"
          y={fontSize * 0.9}
          textAnchor="middle"
        >
          {text}
        </SvgText>
      </Svg>
    </View>
  );
};
