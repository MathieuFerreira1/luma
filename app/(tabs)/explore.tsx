import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { ScreenContainer } from '@/src/components/layout/ScreenContainer';
import { useLessonStore } from '@/src/store/lessonStore';
import { useUserProgress } from '@/src/hooks/useUserData';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface CategoryTab {
  id: string;
  name: string;
  icon: string;
  color: string;
}

type LessonStatus = 'completed' | 'available' | 'locked';

interface LessonPathItem {
  id: string;
  title: string;
  status: LessonStatus;
}

export default function ExploreScreen() {
  const { categories, lessons, fetchLessons, fetchCategories } = useLessonStore();
  const { progress } = useUserProgress();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchLessons();
  }, [fetchCategories, fetchLessons]);

  // Tabs data
  const tabs: CategoryTab[] = [
    { id: 'sleep', name: 'Sommeil', icon: 'moon-o', color: '#AFCBFF' },
    { id: 'nutrition', name: 'Nutrition', icon: 'apple', color: '#9DB8A1' },
    { id: 'brain', name: 'Cerveau', icon: 'bolt', color: '#F4C95D' },
    { id: 'movement', name: 'Mouvement', icon: 'heartbeat', color: '#E8A87C' },
    { id: 'longevity', name: 'Longévité', icon: 'leaf', color: '#B8A9C9' },
  ];

  // Get lessons for selected category
  const categoryLessons = selectedCategory
    ? lessons
        .filter((l) => {
          const cat = categories.find((c) => c.slug === selectedCategory);
          return l.category?.id === cat?.id;
        })
        .sort((a, b) => {
          // Sort by difficulty first (beginner -> intermediate -> advanced)
          const diffOrder = { beginner: 0, intermediate: 1, advanced: 2 };
          const diffA = diffOrder[a.difficulty] || 0;
          const diffB = diffOrder[b.difficulty] || 0;
          if (diffA !== diffB) return diffA - diffB;
          // Then by orderIndex
          return (a.orderIndex || 0) - (b.orderIndex || 0);
        })
    : [];

  // Build path items
  const pathItems: LessonPathItem[] = categoryLessons.map((lesson, index) => {
    const isCompleted = progress.completedLessons.includes(lesson.id);
    
    // Find first non-completed lesson
    const firstIncompleteIndex = categoryLessons.findIndex(
      (l) => !progress.completedLessons.includes(l.id)
    );
    
    let status: LessonStatus;
    
    if (isCompleted) {
      status = 'completed';
    } else if (index === firstIncompleteIndex || firstIncompleteIndex === -1) {
      status = 'available';
    } else if (index < firstIncompleteIndex) {
      status = 'completed';
    } else {
      status = 'locked';
    }

    return {
      id: lesson.id,
      title: lesson.title,
      status,
    };
  });

  const handleLessonPress = (lessonId: string, status: string) => {
    if (status !== 'locked') {
      router.push(`/lesson/${lessonId}`);
    }
  };

  const getStatusIcon = (status: LessonStatus) => {
    switch (status) {
      case 'completed':
        return { name: 'check-circle', color: '#9DB8A1' };
      case 'available':
        return { name: 'play-circle', color: '#6E6AE8' };
      case 'locked':
        return { name: 'lock', color: '#D0D5DD' };
    }
  };

  const getStatusStyle = (status: LessonStatus) => {
    switch (status) {
      case 'completed':
        return 'border-sage-green bg-sage-green/10';
      case 'available':
        return 'border-brand bg-brand/10';
      case 'locked':
        return 'border-secondary-text/20 bg-background';
    }
  };

  return (
    <ScreenContainer>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-2">
          <Text className="text-primary-text text-2xl font-bold mb-2">
            Explorer
          </Text>
          <Text className="text-secondary-text text-base mb-4">
            Choisissez votre chemin d'apprentissage
          </Text>
        </View>

        {/* Category Tabs */}
        <View className="px-6 mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            contentContainerStyle={{ gap: 12 }}
          >
            {tabs.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setSelectedCategory(isSelected ? null : tab.id)}
                  className={`items-center justify-center px-5 py-3 rounded-card border-2 ${
                    isSelected
                      ? 'border-brand bg-brand/10'
                      : 'border-background bg-white'
                  }`}
                  style={{ minWidth: 80 }}
                >
                  <FontAwesome
                    name={tab.icon as any}
                    size={24}
                    color={isSelected ? '#6E6AE8' : tab.color}
                  />
                  <Text
                    className={`text-xs font-medium mt-1 ${
                      isSelected ? 'text-brand' : 'text-secondary-text'
                    }`}
                  >
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Path Content */}
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {!selectedCategory ? (
            <View className="items-center justify-center py-20">
              <FontAwesome name="compass" size={48} color="#E5E7EB" />
              <Text className="text-secondary-text text-base mt-4 text-center">
                Sélectionnez une catégorie pour voir{'\n'}votre chemin d'apprentissage
              </Text>
            </View>
          ) : pathItems.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Text className="text-secondary-text text-base">
                Pas encore de leçons dans cette catégorie
              </Text>
            </View>
          ) : (
            <View className="pb-8">
              {/* Path Title */}
              <Text className="text-primary-text text-lg font-semibold mb-6">
                {tabs.find((t) => t.id === selectedCategory)?.name}
              </Text>

              {/* Path Items */}
              {pathItems.map((item, index) => {
                const statusIcon = getStatusIcon(item.status);
                const isLast = index === pathItems.length - 1;
                const categoryColor = tabs.find((t) => t.id === selectedCategory)?.color;

                return (
                  <View key={item.id} className="flex-row">
                    {/* Left side: line and dot */}
                    <View className="items-center mr-4" style={{ width: 24 }}>
                      {/* Top line (not for first item) */}
                      {index > 0 && (
                        <View
                          className="w-0.5 flex-1"
                          style={{
                            backgroundColor:
                              item.status === 'locked' ? '#E5E7EB' : categoryColor,
                            opacity: item.status === 'locked' ? 0.3 : 0.5,
                          }}
                        />
                      )}
                      
                      {/* Dot */}
                      <TouchableOpacity
                        onPress={() => handleLessonPress(item.id, item.status)}
                        disabled={item.status === 'locked'}
                        className="z-10"
                      >
                        <View
                          className={`w-8 h-8 rounded-full items-center justify-center border-2 ${getStatusStyle(
                            item.status
                          )}`}
                        >
                          <FontAwesome
                            name={statusIcon.name as any}
                            size={14}
                            color={statusIcon.color}
                          />
                        </View>
                      </TouchableOpacity>

                      {/* Bottom line (not for last item) */}
                      {!isLast && (
                        <View
                          className="w-0.5 flex-1"
                          style={{
                            backgroundColor:
                              item.status === 'completed' ? categoryColor : '#E5E7EB',
                            opacity: item.status === 'completed' ? 0.5 : 0.3,
                          }}
                        />
                      )}
                    </View>

                    {/* Right side: lesson info */}
                    <TouchableOpacity
                      onPress={() => handleLessonPress(item.id, item.status)}
                      disabled={item.status === 'locked'}
                      className={`flex-1 pb-6 ${item.status === 'locked' ? 'opacity-60' : ''}`}
                      style={{ marginTop: index === 0 ? 0 : -12 }}
                    >
                      <View
                        className={`bg-white rounded-card p-4 shadow-card border-l-4 ${
                          item.status === 'available'
                            ? 'border-brand'
                            : item.status === 'completed'
                            ? 'border-sage-green'
                            : 'border-transparent'
                        }`}
                      >
                        <Text
                          className={`text-base font-semibold mb-1 ${
                            item.status === 'locked'
                              ? 'text-secondary-text'
                              : 'text-primary-text'
                          }`}
                        >
                          {item.title}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          {item.status === 'completed' && (
                            <Text className="text-sage-green text-xs">
                              ✓ Déjà complétée
                            </Text>
                          )}
                          {item.status === 'available' && (
                            <Text className="text-brand text-xs">
                              ➤ Cliquez pour commencer
                            </Text>
                          )}
                          {item.status === 'locked' && (
                            <Text className="text-secondary-text text-xs">
                              🔒 Terminez les leçons précédentes
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
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
