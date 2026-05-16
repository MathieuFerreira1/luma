import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS } from '@/src/constants/theme';

type QuizAnimationType = 'correct' | 'incorrect' | 'none';

interface QuizAnswerAnimationProps {
  type: QuizAnimationType;
  onComplete?: () => void;
}

export function QuizAnswerAnimation({ type, onComplete }: QuizAnswerAnimationProps) {
  const scale = useSharedValue(1);
  const shake = useSharedValue(0);
  const borderColor = useSharedValue(0);

  useEffect(() => {
    if (type === 'correct') {
      scale.value = withSequence(
        withSpring(1.05, { damping: 12 }),
        withSpring(1, { damping: 12 })
      );
      borderColor.value = withTiming(1, { duration: 300 });
      if (onComplete) {
        setTimeout(() => runOnJS(onComplete)(), 800);
      }
    } else if (type === 'incorrect') {
      shake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 100 })
      );
      borderColor.value = withTiming(2, { duration: 300 });
      if (onComplete) {
        setTimeout(() => runOnJS(onComplete)(), 600);
      }
    } else {
      scale.value = 1;
      shake.value = 0;
      borderColor.value = 0;
    }
  }, [type, scale, shake, borderColor, onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: shake.value },
    ],
    borderColor: interpolateColor(
      borderColor.value,
      [0, 1, 2],
      [COLORS.border, COLORS.status.success, COLORS.category.brain]
    ),
  }));

  if (type === 'none') return null;

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute inset-0 items-center justify-center z-40"
      pointerEvents="none"
    >
      <View className="bg-card rounded-card p-6 shadow-card items-center">
        <Text className="text-5xl mb-2">
          {type === 'correct' ? '✅' : '❌'}
        </Text>
        <Text className="text-lg font-semibold" style={{ color: type === 'correct' ? COLORS.status.success : COLORS.category.brain }}>
          {type === 'correct' ? 'Bonne réponse !' : 'Pas tout à fait...'}
        </Text>
      </View>
    </Animated.View>
  );
}


