import { Text, View, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '@/src/components/layout/ScreenContainer';
import { useLessonStore } from '@/src/store/lessonStore';
import { useUserProfile, useUserProgress } from '@/src/hooks/useUserData';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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

  const question = quiz[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const isCorrect = index === question.correctAnswer;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        onComplete(correctCount + (isCorrect ? 1 : 0));
      }
    }, 800);
  };

  if (showResult) {
    return (
      <View className="bg-white rounded-card p-6 shadow-card items-center">
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

      <View className="gap-3">
        {question.options.map((option: string, index: number) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showCorrectness = selectedAnswer !== null;

          return (
            <TouchableOpacity
              key={index}
              className={`p-4 rounded-button border-2 ${
                showCorrectness
                  ? isCorrect
                    ? 'bg-sage-green/20 border-sage-green'
                    : isSelected
                      ? 'bg-accent-yellow/20 border-accent-yellow'
                      : 'bg-background border-background'
                  : isSelected
                    ? 'bg-brand/10 border-brand'
                    : 'bg-white border-secondary-text/20'
              }`}
              onPress={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
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
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
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

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center justify-between py-4">
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome name="arrow-left" size={22} color="#1D2235" />
            </TouchableOpacity>
            <View className="flex-1 mx-4 h-1.5 bg-background rounded-full">
              <View
                className="h-full bg-brand rounded-full"
                style={{ width: showQuiz ? '80%' : '40%' }}
              />
            </View>
          </View>

          {/* Category Badge */}
          <View className="flex-row items-center gap-2 mb-4">
            <View
              className="rounded-pill px-3 py-1"
              style={{ backgroundColor: `${currentLesson.category.color}30` }}
            >
              <Text className="text-primary-text text-xs font-medium">
                {currentLesson.category.name}
              </Text>
            </View>
            <Text className="text-secondary-text text-xs">
              {currentLesson.duration} min —{' '}
              {currentLesson.difficulty === 'beginner' ? 'Débutant' : 'Intermédiaire'}
            </Text>
          </View>

          {isCompleted ? (
            <View className="bg-sage-green/10 rounded-card p-6 mb-6">
              <Text className="text-sage-green text-lg font-semibold text-center">
                ✓ Leçon déjà complétée
              </Text>
            </View>
          ) : showReward ? (
            <View className="bg-white rounded-card p-8 shadow-card items-center">
              <View className="w-20 h-20 bg-brand/10 rounded-full items-center justify-center mb-4">
                <Text className="text-4xl">⭐</Text>
              </View>

              <Text className="text-primary-text text-2xl font-bold mb-2">
                +{earnedXP} XP
              </Text>

              <Text className="text-primary-text text-base text-center mb-6">
                {currentLesson.blocks.find((b: any) => b.type === 'takeaway')?.content}
              </Text>

              <TouchableOpacity className="bg-brand rounded-button py-3 px-8" onPress={() => router.replace('/(tabs)/home')}>
                <Text className="text-white font-semibold text-base">Continuer</Text>
              </TouchableOpacity>
            </View>
          ) : showQuiz ? (
            <View className="py-4">
              <Text className="text-primary-text text-xl font-bold mb-6">
                Quiz rapide
              </Text>
              <QuizRenderer quiz={currentLesson.quiz} onComplete={handleQuizComplete} />
            </View>
          ) : (
            <View className="py-4">
              <Text className="text-primary-text text-2xl font-bold mb-6 leading-tight">
                {currentLesson.title}
              </Text>

              {currentLesson.blocks.map((block, index) => (
                <LessonBlockRenderer key={index} block={block} />
              ))}

              {/* Light Application Block */}
              <View className="bg-background rounded-card p-5 mb-6">
                <Text className="text-primary-text text-sm font-medium mb-2">
                  💭 Pour essayer
                </Text>
                <Text className="text-secondary-text text-sm leading-relaxed">
                  Vous pouvez essayer de passer quelques minutes dehors demain matin.
                </Text>
              </View>

              <TouchableOpacity
                className="bg-brand rounded-button py-4 items-center shadow-button mb-8"
                onPress={() => setShowQuiz(true)}
              >
                <Text className="text-white font-semibold text-base">
                  Passer au quiz
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}
