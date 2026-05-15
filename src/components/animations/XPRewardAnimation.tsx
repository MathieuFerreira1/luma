import React, { useEffect, useCallback } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';

interface XPRewardAnimationProps {
  amount: number;
  onComplete?: () => void;
  visible: boolean;
}

export function XPRewardAnimation({ amount, onComplete, visible }: XPRewardAnimationProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const particle1Y = useSharedValue(0);
  const particle2Y = useSharedValue(0);
  const particle3Y = useSharedValue(0);

  const startAnimation = useCallback(() => {
    'worklet';
    scale.value = withSequence(
      withSpring(1.2, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    
    opacity.value = withSequence(
      withSpring(1, { damping: 10 }),
      withDelay(2000, withSpring(0, { damping: 10 }))
    );

    translateY.value = withDelay(
      300,
      withSpring(-30, { damping: 15, stiffness: 100 })
    );

    particle1Y.value = withDelay(200, withSpring(-80, { damping: 12 }));
    particle2Y.value = withDelay(300, withSpring(-60, { damping: 12 }));
    particle3Y.value = withDelay(400, withSpring(-70, { damping: 12 }));

    if (onComplete) {
      runOnJS(onComplete)();
    }
  }, [scale, opacity, translateY, particle1Y, particle2Y, particle3Y, onComplete]);

  useEffect(() => {
    if (visible) {
      startAnimation();
    } else {
      scale.value = 0;
      opacity.value = 0;
      translateY.value = 0;
      particle1Y.value = 0;
      particle2Y.value = 0;
      particle3Y.value = 0;
    }
  }, [visible, startAnimation, scale, opacity, translateY, particle1Y, particle2Y, particle3Y]);

  const mainStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  const particle1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle1Y.value }],
    opacity: interpolate(
      particle1Y.value,
      [-80, -40, 0],
      [0, 1, 0],
      Extrapolation.CLAMP
    ),
  }));

  const particle2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle2Y.value }],
    opacity: interpolate(
      particle2Y.value,
      [-60, -30, 0],
      [0, 1, 0],
      Extrapolation.CLAMP
    ),
  }));

  const particle3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle3Y.value }],
    opacity: interpolate(
      particle3Y.value,
      [-70, -35, 0],
      [0, 1, 0],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <View className="absolute inset-0 items-center justify-center pointer-events-none z-50">
      <Animated.View style={mainStyle} className="items-center">
        <View className="bg-white rounded-card p-8 shadow-card items-center">
          <Text className="text-5xl mb-2">⭐</Text>
          <Text className="text-brand text-4xl font-bold">+{amount} XP</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[particle1Style, { position: 'absolute', top: '40%', left: '20%' }]}
      >
        <Text className="text-2xl">✨</Text>
      </Animated.View>

      <Animated.View
        style={[particle2Style, { position: 'absolute', top: '45%', right: '20%' }]}
      >
        <Text className="text-2xl">✨</Text>
      </Animated.View>

      <Animated.View
        style={[particle3Style, { position: 'absolute', top: '35%', left: '40%' }]}
      >
        <Text className="text-2xl">✨</Text>
      </Animated.View>
    </View>
  );
}
