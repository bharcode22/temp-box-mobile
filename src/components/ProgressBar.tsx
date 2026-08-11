import React from 'react';
import { View, DimensionValue } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, height = 8 }) => {
  const clampedProgress = Math.min(Math.max(progress, 0.02), 1);
  const percentWidth: DimensionValue = `${clampedProgress * 100}%`;

  return (
    <View className="w-full bg-slate-800/80 rounded-full overflow-hidden my-3" style={{ height }}>
      <View style={{ width: percentWidth, height: '100%', borderRadius: 999 }}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#6366F1" />
              <Stop offset="50%" stopColor="#818CF8" />
              <Stop offset="100%" stopColor="#C084FC" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" rx={height / 2} fill="url(#progressGrad)" />
        </Svg>
      </View>
    </View>
  );
};
