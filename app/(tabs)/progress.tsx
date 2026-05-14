import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/store/authStore';
import { useUserProfile, useUserProgress } from '@/src/hooks/useUserData';
import { useLessonStore } from '@/src/store/lessonStore';
import { ScreenContainer } from '@/src/components/layout/ScreenContainer';
import { SectionTitle } from '@/src/components/text/SectionTitle';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ProgressScreen() {
  const { user } = useAuthStore();
  const { profile, loading: profileLoading } = useUserProfile();
  const { progress, loading: progressLoading } = useUserProgress();
  const { lessons, categories } = useLessonStore();

  const isLoading = profileLoading || progressLoading;

  const level = profile?.level || 1;
  const xp = profile?.xp || 0;
  const streak = profile?.streak || 0;

  // Level thresholds for display
  const levelThresholds = [0, 100, 250, 500, 850, 1300];
  const currentLevelXP = levelThresholds[level - 1] || 0;
  const nextLevelXP = levelThresholds[level] || levelThresholds[levelThresholds.length - 1];
  const xpProgress = Math.min(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100, 100);

  const levelTitle = level <= 3 ? 'Explorateur' : level <= 6 ? 'Curieux' : 'Passionné';

  return (
    <ScreenContainer>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <Text className="text-primary-text text-2xl font-bold mt-2 mb-6">
            Progression
          </Text>

          {/* Hero Stats */}
          <View className="bg-white rounded-card p-6 shadow-card mb-8 items-center">
            <Text className="text-brand text-4xl font-bold mb-1">Niveau {level}</Text>
            <Text className="text-secondary-text text-base mb-4">{levelTitle}</Text>

            <View className="w-full h-3 bg-background rounded-full overflow-hidden mb-2">
              <View className="h-full bg-brand rounded-full" style={{ width: `${xpProgress}%` }} />
            </View>
            <Text className="text-secondary-text text-sm">
              {xp} / {nextLevelXP} XP
            </Text>
          </View>

          {/* Stats */}
          <SectionTitle>Statistiques</SectionTitle>

          <View className="flex-row gap-3 mb-8">
            <View className="bg-white rounded-card p-4 shadow-card flex-1 items-center">
              <Text className="text-primary-text text-2xl font-bold">{progress.totalLessons}</Text>
              <Text className="text-secondary-text text-xs mt-1">Leçons</Text>
            </View>
            <View className="bg-white rounded-card p-4 shadow-card flex-1 items-center">
              <Text className="text-primary-text text-2xl font-bold">{progress.totalLearningTime}m</Text>
              <Text className="text-secondary-text text-xs mt-1">Apprentissage</Text>
            </View>
            <View className="bg-white rounded-card p-4 shadow-card flex-1 items-center">
              <Text className="text-primary-text text-2xl font-bold">{streak}j</Text>
              <Text className="text-secondary-text text-xs mt-1">Série</Text>
            </View>
          </View>

          {/* Achievements */}
          <SectionTitle>Badges</SectionTitle>

          {isLoading ? (
            <Text className="text-secondary-text text-center py-4">Chargement...</Text>
          ) : (
            <View className="flex-row flex-wrap gap-3 pb-8">
              {progress.achievements.length > 0 ? (
                progress.achievements.map((slug) => (
                  <View
                    key={slug}
                    className="bg-white rounded-card p-4 shadow-card items-center flex-1 min-w-[100px]"
                  >
                    <FontAwesome name="star" size={28} color="#6E6AE8" />
                    <Text className="text-primary-text text-xs font-medium mt-2 text-center capitalize">
                      {slug.replace(/-/g, ' ')}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-secondary-text text-center py-4 w-full">
                  Complétez des leçons pour débloquer des badges
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}
