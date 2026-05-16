import { View, Text } from 'react-native';
import { COLORS } from '@/src/constants/theme';

interface XPBarProps {
  current: number;
  max: number;
  label?: string;
}

export function XPBar({ current, max, label }: XPBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <View className="w-full">
      {label && (
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-secondary-text text-sm">{label}</Text>
          <Text className="text-secondary-text text-sm">
            {current} / {max} XP
          </Text>
        </View>
      )}
      <View className="h-3 bg-background rounded-full overflow-hidden">
        <View
          className="h-full bg-brand rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0-100
  children?: React.ReactNode;
}

export function CircularProgress({
  size = 80,
  strokeWidth = 6,
  progress,
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Text className="absolute text-primary-text text-lg font-bold z-10">
        {children}
      </Text>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: COLORS.border,
          position: 'absolute',
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: COLORS.brand,
          borderTopColor: 'transparent',
          borderLeftColor: 'transparent',
          borderBottomColor: 'transparent',
          transform: [{ rotate: `${-90 + (progress * 3.6)}deg` }],
          position: 'absolute',
        }}
      />
    </View>
  );
}
