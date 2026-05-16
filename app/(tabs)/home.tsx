import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { ScreenContainer } from '@/src/components/layout/ScreenContainer';
import { COLORS } from '@/src/constants/theme';
import { SectionTitle } from '@/src/components/text/SectionTitle';
import { useAuthStore } from '@/src/store/authStore';
import { useLessonStore } from '@/src/store/lessonStore';
import { useUserProfile, useUserProgress } from '@/src/hooks/useUserData';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { lessons, isLoading: lessonsLoading, fetchLessons } = useLessonStore();
  const { profile, loading: profileLoading } = useUserProfile();
  const { progress, loading: progressLoading } = useUserProgress();

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const isLoading = lessonsLoading || profileLoading || progressLoading;

  // Find today's lesson (first uncompleted lesson)
  const todayLesson = lessons.find(
    (lesson) => !progress.completedLessons.includes(lesson.id)
  );

  // Calculate category progress
  const categoryProgress = lessons.reduce((acc, lesson) => {
    const catId = lesson.category.id;
    if (!acc[catId]) {
      acc[catId] = { ...lesson.category, total: 0, completed: 0 };
    }
    acc[catId].total++;
    if (progress.completedLessons.includes(lesson.id)) {
      acc[catId].completed++;
    }
    return acc;
  }, {} as Record<string, any>);

  // Get display name
  const displayName = profile?.username || user?.email?.split('@')[0] || 'Explorateur';
  const streak = profile?.streak || 0;
  const level = profile?.level || 1;

  return (
    <ScreenContainer>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Top Bar */}
          <View className="flex-row justify-between items-center mt-2 mb-6">
            <View>
              <Text className="text-secondary-text text-sm font-medium">Bonjour</Text>
              <Text className="text-primary-text text-xl font-semibold">{displayName}</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="bg-card rounded-full px-3 py-1.5 shadow-card">
                <Text className="text-brand text-sm font-semibold">🔥 {streak}</Text>
              </View>
              <View className="bg-card rounded-full px-3 py-1.5 shadow-card">
                <Text className="text-brand text-sm font-semibold">⭐ Niv. {level}</Text>
              </View>
            </View>
          </View>

          <SectionTitle>Votre découverte du jour</SectionTitle>

          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.brand} className="py-8" />
          ) : todayLesson ? (
            <Link href={`/lesson/${todayLesson.id}`} asChild>
              <View className="bg-card rounded-card p-6 shadow-card mb-8 active:opacity-90">
                <View className="flex-row items-center gap-2 mb-3">
                  <View
                    className="rounded-pill px-3 py-1"
                    style={{ backgroundColor: `${todayLesson.category.color}30` }}
                  >
                    <Text className="text-primary-text text-xs font-medium">
                      {todayLesson.category.name}
                    </Text>
                  </View>
                  <Text className="text-secondary-text text-xs">{todayLesson.duration} min</Text>
                </View>

                <Text className="text-primary-text text-xl font-bold mb-2 leading-tight">
                  {todayLesson.title}
                </Text>
                <Text className="text-secondary-text text-sm mb-4 leading-relaxed">
                  {todayLesson.hook}
                </Text>

                <View className="bg-brand rounded-button py-3 px-6 items-center">
                  <Text className="text-white font-semibold text-base">
                    Découvrir la leçon
                  </Text>
                </View>
              </View>
            </Link>
          ) : (
            <View className="bg-card rounded-card p-6 shadow-card mb-8 items-center">
              <Text className="text-4xl mb-2">🎉</Text>
              <Text className="text-primary-text text-lg font-bold text-center mb-2">
                Félicitations !
              </Text>
              <Text className="text-secondary-text text-center">
                Vous avez complété toutes les leçons disponibles.
              </Text>
            </View>
          )}

          <SectionTitle>Vos progrès</SectionTitle>

          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.brand} className="py-4" />
          ) : (
            <View className="gap-3">
              {Object.values(categoryProgress).map((cat: any) => {
                const percent = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
                return (
                  <View key={cat.id} className="bg-card rounded-card p-4 shadow-card">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-primary-text font-medium">{cat.name}</Text>
                      <Text className="text-brand font-semibold">
                        {cat.completed}/{cat.total}
                      </Text>
                    </View>
                    <View className="h-2 bg-background rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{ width: `${percent}%`, backgroundColor: cat.color }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}
