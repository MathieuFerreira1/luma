import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { Link } from 'expo-router';
import { ScreenContainer } from '@/src/components/layout/ScreenContainer';
import { SectionTitle } from '@/src/components/text/SectionTitle';
import { useAuthStore } from '@/src/store/authStore';
import { useLessonStore } from '@/src/store/lessonStore';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { lessons, isLoading, error, fetchLessons } = useLessonStore();

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const todayLesson = lessons[0]; // First available lesson

  return (
    <ScreenContainer>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Top Bar */}
          <View className="flex-row justify-between items-center mt-2 mb-6">
            <View>
              <Text className="text-secondary-text text-sm font-medium">Bonjour</Text>
              <Text className="text-primary-text text-xl font-semibold">
                {user?.email?.split('@')[0] || 'Explorateur'}
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="bg-white rounded-full px-3 py-1.5 shadow-card">
                <Text className="text-brand text-sm font-semibold">🔥 0</Text>
              </View>
              <View className="bg-white rounded-full px-3 py-1.5 shadow-card">
                <Text className="text-brand text-sm font-semibold">⭐ Niv. 1</Text>
              </View>
            </View>
          </View>

          <SectionTitle>Votre découverte du jour</SectionTitle>

          {isLoading ? (
            <ActivityIndicator size="large" color="#6E6AE8" className="py-8" />
          ) : error ? (
            <View className="bg-accent-yellow/20 rounded-card p-6 mb-8">
              <Text className="text-primary-text text-center">
                Impossible de charger les leçons. Mode hors ligne activé.
              </Text>
            </View>
          ) : todayLesson ? (
            <Link href={`/lesson/${todayLesson.id}`} asChild>
              <View className="bg-white rounded-card p-6 shadow-card mb-8 active:opacity-90">
                <View className="flex-row items-center gap-2 mb-3">
                  <View 
                    className="rounded-pill px-3 py-1"
                    style={{ backgroundColor: `${todayLesson.category.color}30` }}
                  >
                    <Text className="text-primary-text text-xs font-medium">
                      {todayLesson.category.name}
                    </Text>
                  </View>
                  <Text className="text-secondary-text text-xs">
                    {todayLesson.duration} min
                  </Text>
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
            <View className="bg-white rounded-card p-6 shadow-card mb-8 items-center">
              <Text className="text-secondary-text text-center">
                Plus de leçons disponibles pour le moment.
              </Text>
            </View>
          )}

          <SectionTitle>Vos progrès</SectionTitle>
          
          {isLoading ? (
            <ActivityIndicator size="small" color="#6E6AE8" className="py-4" />
          ) : (
            <View className="gap-3">
              {Object.entries(
                lessons.reduce((acc, lesson) => {
                  const catName = lesson.category.name;
                  if (!acc[catName]) {
                    acc[catName] = { color: lesson.category.color, count: 0 };
                  }
                  acc[catName].count++;
                  return acc;
                }, {} as Record<string, { color: string; count: number }>)
              ).map(([name, data]) => (
                <View key={name} className="bg-white rounded-card p-4 shadow-card">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-primary-text font-medium">{name}</Text>
                    <Text className="text-brand font-semibold">{data.count} leçons</Text>
                  </View>
                  <View className="h-2 bg-background rounded-full overflow-hidden">
                    <View className="h-full rounded-full" style={{ width: '10%', backgroundColor: data.color }} />
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}
