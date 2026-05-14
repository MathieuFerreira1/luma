import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { Link } from 'expo-router';
import { ScreenContainer } from '@/src/components/layout/ScreenContainer';
import { SectionTitle } from '@/src/components/text/SectionTitle';
import { useLessonStore } from '@/src/store/lessonStore';
import { useUserProgress } from '@/src/hooks/useUserData';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const categoryIcons: Record<string, string> = {
  sleep: 'moon-o',
  nutrition: 'apple',
  brain: 'bolt',
  movement: 'heartbeat',
  longevity: 'leaf',
};

export default function ExploreScreen() {
  const { categories, lessons, isLoading: lessonsLoading, fetchLessons, fetchCategories } = useLessonStore();
  const { progress, loading: progressLoading } = useUserProgress();

  useEffect(() => {
    fetchCategories();
    fetchLessons();
  }, [fetchCategories, fetchLessons]);

  const isLoading = lessonsLoading || progressLoading;

  // Build category stats
  const categoryStats = categories.map((category) => {
    const catLessons = lessons.filter((l) => l.category.id === category.id);
    const completedCount = catLessons.filter((l) =>
      progress.completedLessons.includes(l.id)
    ).length;
    const totalCount = catLessons.length;
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      ...category,
      slug: lessons.find((l) => l.category.id === category.id)?.category.id || category.id,
      completedCount,
      totalCount,
      percent,
      icon: categoryIcons[lessons.find((l) => l.category.id === category.id)?.category.id || ''] || 'circle',
    };
  });

  // Get 4 random lessons for discovery
  const discoveryLessons = lessons
    .filter((l) => !progress.completedLessons.includes(l.id))
    .slice(0, 4);

  return (
    <ScreenContainer>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <Text className="text-primary-text text-2xl font-bold mt-2 mb-2">
            Explorer
          </Text>
          <Text className="text-secondary-text text-base mb-6">
            Découvrez tous nos sujets de santé
          </Text>

          <SectionTitle>Catégories</SectionTitle>

          {isLoading ? (
            <ActivityIndicator size="large" color="#6E6AE8" className="py-8" />
          ) : (
            <View className="gap-4 mb-8">
              {categoryStats.map((category) => (
                <View key={category.id} className="bg-white rounded-card p-5 shadow-card">
                  <View className="flex-row items-center gap-4">
                    <View
                      className="w-12 h-12 rounded-button items-center justify-center"
                      style={{ backgroundColor: `${category.color}30` }}
                    >
                      <FontAwesome name={category.icon as any} size={22} color={category.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-primary-text text-base font-semibold">
                        {category.name}
                      </Text>
                      <Text className="text-secondary-text text-sm">
                        {category.completedCount > 0
                          ? `${category.completedCount}/${category.totalCount} leçons`
                          : category.totalCount > 0
                            ? `${category.totalCount} leçons`
                            : 'À découvrir'}
                      </Text>
                    </View>
                    <FontAwesome name="chevron-right" size={16} color="#667085" />
                  </View>

                  {category.totalCount > 0 && (
                    <View className="h-1.5 bg-background rounded-full mt-3 overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{ width: `${category.percent}%`, backgroundColor: category.color }}
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          <SectionTitle>À découvrir</SectionTitle>

          {isLoading ? (
            <ActivityIndicator size="small" color="#6E6AE8" className="py-4" />
          ) : discoveryLessons.length > 0 ? (
            <View className="flex-row flex-wrap gap-3 pb-8">
              {discoveryLessons.map((lesson) => (
                <Link key={lesson.id} href={`/lesson/${lesson.id}`} asChild>
                  <View className="bg-white rounded-card p-4 shadow-card flex-1 min-w-[140px] active:opacity-90">
                    <View
                      className="rounded-pill px-2 py-0.5 self-start mb-2"
                      style={{ backgroundColor: `${lesson.category.color}20` }}
                    >
                      <Text className="text-xs font-medium" style={{ color: lesson.category.color }}>
                        {lesson.category.name}
                      </Text>
                    </View>
                    <Text className="text-primary-text font-semibold mb-1 text-sm">
                      {lesson.title}
                    </Text>
                    <Text className="text-secondary-text text-xs">
                      {lesson.duration} min
                    </Text>
                  </View>
                </Link>
              ))}
            </View>
          ) : (
            <Text className="text-secondary-text text-center py-4">
              Vous avez tout exploré ! 🎉
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}
