import { Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '@/src/components/layout/ScreenContainer';
import { useLessonStore } from '@/src/store/lessonStore';
import { useUserProfile, useUserProgress } from '@/src/hooks/useUserData';
import { XPRewardAnimation } from '@/src/components/animations/XPRewardAnimation';
import { QuizAnswerAnimation } from '@/src/components/animations/QuizAnswerAnimation';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { COLORS } from '@/src/constants/theme';

function LessonBlockRenderer({ block }: { block: { type: string; content?: string } }) {
  switch (block.type) {
    case 'hook':
      return (
        <View className="bg-brand/10 rounded-card p-6 mb-6">
          <Text className="text-brand text-2xl font-bold leading-tight">
            {block.content}
          </Text>
        </View>
      );
    case 'text':
      return (
        <View className="mb-4">
          <Text className="text-primary-text text-base leading-relaxed">
            {block.content}
          </Text>
        </View>
      );
    case 'takeaway':
      return (
        <View className="bg-sage-green/10 rounded-card p-5 mb-6 border-l-4 border-sage-green">
          <Text className="text-primary-text text-base font-semibold leading-relaxed">
            💡 {block.content}
          </Text>
        </View>
      );
    default:
      return (
        <View className="mb-4">
          <Text className="text-secondary-text">{block.content}</Text>
        </View>
      );
  }
}

function QuizRenderer({ quiz, onComplete }: { quiz: any[]; onComplete: (correct: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizAnimation, setQuizAnimation] = useState<'correct' | 'incorrect' | 'none'>('none');

  const question = quiz[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const isCorrect = index === question.correctAnswer;
    
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setQuizAnimation('correct');
    } else {
      setQuizAnimation('incorrect');
    }
  };

  const handleAnimationComplete = () => {
    setQuizAnimation('none');
    
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      onComplete(correctCount + (selectedAnswer !== null && selectedAnswer === question.correctAnswer ? 1 : 0));
    }
  };

  if (showResult) {
    return (
      <View className="bg-card rounded-card p-6 shadow-card items-center">
        <Text className="text-4xl mb-2">{correctCount === quiz.length ? '🎉' : '✨'}</Text>
        <Text className="text-primary-text text-2xl font-bold mb-2">
          {correctCount}/{quiz.length} bonnes réponses
        </Text>
        <Text className="text-secondary-text text-center">
          {correctCount === quiz.length
            ? 'Parfait ! Vous maîtrisez ce sujet.'
            : 'Continuez à apprendre, vous progressez !'}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-secondary-text text-sm mb-4">
        Question {currentQuestion + 1}/{quiz.length}
      </Text>
      <Text className="text-primary-text text-lg font-semibold mb-6">
        {question.question}
      </Text>

      <View className="gap-3 relative">
        {question.options.map((option: string, index: number) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showCorrectness = selectedAnswer !== null;

          return (
            <AnimatedTouchableAnswer
              key={index}
              index={index}
              option={option}
              isSelected={isSelected}
              isCorrect={isCorrect}
              showCorrectness={showCorrectness}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            />
          );
        })}
      </View>

      {quizAnimation !== 'none' && (
        <QuizAnswerAnimation
          type={quizAnimation}
          onComplete={handleAnimationComplete}
        />
      )}
    </View>
  );
}

function AnimatedTouchableAnswer({
  index,
  option,
  isSelected,
  isCorrect,
  showCorrectness,
  onPress,
  disabled,
}: {
  index: number;
  option: string;
  isSelected: boolean;
  isCorrect: boolean;
  showCorrectness: boolean;
  onPress: () => void;
  disabled: boolean;
}) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(0.98, { damping: 10 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10 });
    }, 100);
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      className={`p-4 rounded-button border-2 ${
        showCorrectness
          ? isCorrect
            ? 'bg-sage-green/20 border-sage-green'
            : isSelected
              ? 'bg-accent-yellow/20 border-accent-yellow'
              : 'bg-background border-background'
          : isSelected
            ? 'bg-brand/10 border-brand'
            : 'bg-card border-secondary-text/20'
      }`}
      onPress={handlePress}
      disabled={disabled}
    >
      <Animated.View style={animatedStyle}>
        <Text
          className={`text-base font-medium ${
            showCorrectness && isCorrect
              ? 'text-sage-green'
              : showCorrectness && isSelected
                ? 'text-accent-yellow'
                : 'text-primary-text'
          }`}
        >
          {option}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessons = useLessonStore((state) => state.lessons);
  const { completeLesson } = useLessonStore();
  const { progress } = useUserProgress();

  const currentLesson = lessons.find((l) => l.id === id);

  const [showQuiz, setShowQuiz] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

  useEffect(() => {
    if (id && progress.completedLessons.includes(id)) {
      setIsCompleted(true);
    }
  }, [id, progress.completedLessons]);

  if (!currentLesson) {
    return (
      <ScreenContainer>
        <SafeAreaView className="flex-1 items-center justify-center">
          <Text className="text-primary-text text-lg">Leçon non trouvée</Text>
        </SafeAreaView>
      </ScreenContainer>
    );
  }

  const handleQuizComplete = async (correct: number) => {
    const baseXP = currentLesson.xpReward;
    const perfectBonus = correct === currentLesson.quiz.length ? 10 : 0;
    const totalXP = baseXP + perfectBonus;

    setEarnedXP(totalXP);

    try {
      setTimeout(async () => {
        await completeLesson(currentLesson.id, totalXP);
        setShowReward(true);
      }, 1500);
    } catch (err) {
      console.error('Error completing lesson:', err);
      setShowReward(true);
    }
  };

  const blocks = currentLesson.blocks || [];
  const currentBlock = blocks[currentBlockIndex];
  const isLastBlock = currentBlockIndex === blocks.length - 1;
  const totalSteps = blocks.length + 1; // +1 pour le quiz
  const currentStep = showQuiz ? totalSteps : currentBlockIndex + 1;

  const handleNextBlock = () => {
    if (isLastBlock) {
      setShowQuiz(true);
    } else {
      setCurrentBlockIndex((prev) => prev + 1);
    }
  };

  const renderCurrentBlock = () => {
    if (!currentBlock) return null;

    switch (currentBlock.type) {
      case 'hook':
        return (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-brand text-3xl font-bold leading-tight text-center">
              {currentBlock.content}
            </Text>
          </View>
        );
      case 'text':
        return (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-primary-text text-xl leading-relaxed text-center">
              {currentBlock.content}
            </Text>
          </View>
        );
      case 'takeaway':
        return (
          <View className="flex-1 items-center justify-center px-4">
            <View className="bg-sage-green/10 rounded-card p-6 border-l-4 border-sage-green">
              <Text className="text-sage-green text-4xl text-center mb-4">💡</Text>
              <Text className="text-primary-text text-xl font-semibold leading-relaxed text-center">
                {currentBlock.content}
              </Text>
            </View>
          </View>
        );
      default:
        return (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-secondary-text text-xl text-center">
              {currentBlock.content}
            </Text>
          </View>
        );
    }
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1">
        {/* Header with progress */}
        <View className="px-6 pt-4">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome name="arrow-left" size={22} color={COLORS.text.secondary} />
            </TouchableOpacity>
            <Text className="text-secondary-text text-sm">
              {currentStep}/{totalSteps}
            </Text>
          </View>
          <View className="h-1.5 bg-background rounded-full mb-4">
            <View
              className="h-full bg-brand rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </View>
        </View>

        {/* Main content */}
        <View className="flex-1 px-6">
          {isCompleted ? (
            <View className="flex-1 items-center justify-center">
              <View className="bg-sage-green/10 rounded-card p-6">
                <Text className="text-sage-green text-4xl text-center mb-4">✓</Text>
                <Text className="text-sage-green text-xl font-semibold text-center">
                  Leçon déjà complétée
                </Text>
              </View>
            </View>
          ) : showReward ? (
            <View className="flex-1 items-center justify-center">
              <View className="bg-card rounded-card p-8 shadow-card items-center">
                <View className="w-20 h-20 bg-brand/10 rounded-full items-center justify-center mb-4">
                  <Text className="text-4xl">⭐</Text>
                </View>
                <Text className="text-brand text-4xl font-bold mb-2">
                  +{earnedXP} XP
                </Text>
                <Text className="text-primary-text text-base text-center mb-6">
                  {currentLesson.blocks.find((b: any) => b.type === 'takeaway')?.content}
                </Text>
                <TouchableOpacity 
                  className="bg-brand rounded-button py-3 px-8" 
                  onPress={() => router.replace('/(tabs)/home')}
                >
                  <Text className="text-white font-semibold text-base">Continuer</Text>
                </TouchableOpacity>
              </View>
              <XPRewardAnimation amount={earnedXP} visible={showReward} />
            </View>
          ) : showQuiz ? (
            <View className="flex-1">
              <View className="mb-4">
                <Text className="text-primary-text text-xl font-bold">
                  Quiz rapide
                </Text>
              </View>
              <View className="flex-1">
                <QuizRenderer quiz={currentLesson.quiz} onComplete={handleQuizComplete} />
              </View>
            </View>
          ) : (
            <View className="flex-1">
              {/* Block content */}
              <View className="flex-1">
                {renderCurrentBlock()}
              </View>

              {/* Bottom button */}
              <View className="pb-8 pt-4">
                <TouchableOpacity
                  className="bg-brand rounded-button py-4 items-center shadow-button"
                  onPress={handleNextBlock}
                >
                  <Text className="text-white font-semibold text-base">
                    {isLastBlock ? 'Passer au quiz' : 'Continuer'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ScreenContainer>
  );
}
