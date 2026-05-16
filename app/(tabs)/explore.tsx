import { Text, View, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
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

interface LessonPathItem {
  id: string;
  title: string;
  hook: string;
  difficulty: string;
  duration: number;
  xp: number;
  status: 'completed' | 'available' | 'locked';
}

export default function ExploreScreen() {
  const { categories, lessons, fetchLessons, fetchCategories } = useLessonStore();
  const { progress } = useUserProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('sleep');
  const [selectedLesson, setSelectedLesson] = useState<LessonPathItem | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchLessons();
  }, [fetchCategories, fetchLessons]);

  const tabs: CategoryTab[] = [
    { id: 'sleep', name: 'Sommeil', icon: 'moon-o', color: '#AFCBFF' },
    { id: 'nutrition', name: 'Nutrition', icon: 'apple', color: '#9DB8A1' },
    { id: 'brain', name: 'Cerveau', icon: 'bolt', color: '#F4C95D' },
    { id: 'movement', name: 'Mouvement', icon: 'heartbeat', color: '#E8A87C' },
    { id: 'longevity', name: 'Longévité', icon: 'leaf', color: '#B8A9C9' },
  ];

  const TAB_WIDTH = Dimensions.get('window').width / tabs.length;

  const categoryLessons = lessons
    .filter((l) => {
      const cat = categories.find((c) => c.slug === selectedCategory);
      return l.category?.id === cat?.id;
    })
    .sort((a, b) => {
      const diffOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      const diffA = diffOrder[a.difficulty] || 0;
      const diffB = diffOrder[b.difficulty] || 0;
      if (diffA !== diffB) return diffA - diffB;
      return (a.orderIndex || 0) - (b.orderIndex || 0);
    });

  const pathItems: LessonPathItem[] = categoryLessons.map((lesson, index) => {
    const isCompleted = progress.completedLessons.includes(lesson.id);
    const firstIncompleteIndex = categoryLessons.findIndex(
      (l) => !progress.completedLessons.includes(l.id)
    );

    let status: 'completed' | 'available' | 'locked';
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
      hook: lesson.hook || '',
      difficulty: lesson.difficulty,
      duration: lesson.duration,
      xp: lesson.xpReward,
      status,
    };
  });

  const handleLessonPress = (lesson: LessonPathItem) => {
    setSelectedLesson(lesson);
  };

  const handleAction = () => {
    if (selectedLesson && selectedLesson.status !== 'locked') {
      router.push(`/lesson/${selectedLesson.id}`);
      setSelectedLesson(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#9DB8A1';
      case 'available':
        return '#6E6AE8';
      case 'locked':
        return '#D0D5DD';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return { name: 'check' as const, color: '#FFFFFF' };
      case 'available':
        return { name: 'play' as const, color: '#FFFFFF' };
      case 'locked':
        return { name: 'lock' as const, color: '#D0D5DD' };
      default:
        return { name: 'circle' as const, color: '#D0D5DD' };
    }
  };

  return (
    <ScreenContainer>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <Text className="text-primary-text text-2xl font-bold">
            Explorer
          </Text>
        </View>

        {/* Fixed Tabs */}
        <View className="flex-row px-0">
          {tabs.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => {
                  setSelectedCategory(tab.id);
                  setSelectedLesson(null);
                }}
                style={{ width: TAB_WIDTH }}
                className={`items-center py-3 border-b-2 ${
                  isSelected ? 'border-brand' : 'border-transparent'
                }`}
              >
                <FontAwesome
                  name={tab.icon as any}
                  size={20}
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
        </View>

        {/* Path Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-4">
            {pathItems.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Text className="text-secondary-text">
                  Pas encore de leçons dans cette catégorie
                </Text>
              </View>
            ) : (
              <View>
                {/* Path Title */}
                <Text className="text-primary-text text-lg font-semibold mb-6">
                  {tabs.find((t) => t.id === selectedCategory)?.name}
                </Text>

                {/* Path Items */}
                {pathItems.map((item, index) => {
                  const statusIcon = getStatusIcon(item.status);
                  const isLast = index === pathItems.length - 1;
                  const statusColor = getStatusColor(item.status);

                  return (
                    <View key={item.id} className="flex-row items-center" style={{ height: 80 }}>
                      {/* Left side: line and dot */}
                      <View className="items-center mr-4 h-full" style={{ width: 32 }}>
                        {/* Top line */}
                        {index > 0 && (
                          <View
                            className="w-1 flex-1"
                            style={{
                              backgroundColor: item.status === 'locked' ? '#E5E7EB' : statusColor,
                              opacity: item.status === 'locked' ? 0.3 : 1,
                            }}
                          />
                        )}

                        {/* Dot */}
                        <TouchableOpacity
                          onPress={() => handleLessonPress(item)}
                          className="z-10"
                        >
                          <View
                            className="w-10 h-10 rounded-full items-center justify-center"
                            style={{
                              backgroundColor:
                                item.status === 'completed'
                                  ? '#9DB8A1'
                                  : item.status === 'available'
                                  ? '#6E6AE8'
                                  : '#F3F4F6',
                              borderWidth: 3,
                              borderColor: statusColor,
                              shadowColor: statusColor,
                              shadowOpacity: 0.3,
                              shadowRadius: 6,
                              elevation: 4,
                            }}
                          >
                            <FontAwesome
                              name={statusIcon.name as any}
                              size={16}
                              color={statusIcon.color}
                            />
                          </View>
                        </TouchableOpacity>

                        {/* Bottom line */}
                        {!isLast && (
                          <View
                            className="w-1 flex-1"
                            style={{
                              backgroundColor: item.status === 'completed' ? '#9DB8A1' : '#E5E7EB',
                              opacity: item.status === 'completed' ? 1 : 0.3,
                            }}
                          />
                        )}
                      </View>

                      {/* Right side: lesson title */}
                      <TouchableOpacity
                        onPress={() => handleLessonPress(item)}
                        className="flex-1 justify-center"
                      >
                        <View className="bg-white rounded-card p-4 shadow-card">
                          <Text
                            className={`text-base font-semibold ${
                              item.status === 'locked'
                                ? 'text-secondary-text'
                                : 'text-primary-text'
                            }`}
                          >
                            {item.title}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Lesson Details Modal */}
        <Modal
          visible={selectedLesson !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedLesson(null)}
        >
          <View className="flex-1">
            {/* Background overlay - clickable to close */}
            <TouchableOpacity
              className="absolute inset-0 bg-black/40"
              onPress={() => setSelectedLesson(null)}
              activeOpacity={1}
            />

            {/* Modal content */}
            <View className="flex-1 items-center justify-center px-6" pointerEvents="box-none">
              <View
                className="bg-white w-full rounded-card p-6 shadow-2xl"
                pointerEvents="auto"
              >
                {selectedLesson && (
                  <>
                    {/* Status Badge */}
                    <View className="flex-row justify-between items-start mb-4">
                      <View
                        className={`rounded-pill px-3 py-1 ${
                          selectedLesson.status === 'completed'
                            ? 'bg-sage-green/20'
                            : selectedLesson.status === 'available'
                            ? 'bg-brand/20'
                            : 'bg-secondary-text/10'
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            selectedLesson.status === 'completed'
                              ? 'text-sage-green'
                              : selectedLesson.status === 'available'
                              ? 'text-brand'
                              : 'text-secondary-text'
                          }`}
                        >
                          {selectedLesson.status === 'completed'
                            ? '✓ Complétée'
                            : selectedLesson.status === 'available'
                            ? 'Disponible'
                            : '🔒 Bloquée'}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => setSelectedLesson(null)}>
                        <FontAwesome name="times" size={20} color="#667085" />
                      </TouchableOpacity>
                    </View>

                    {/* Title & Hook */}
                    <Text className="text-primary-text text-xl font-bold mb-2">
                      {selectedLesson.title}
                    </Text>
                    <Text className="text-secondary-text text-sm leading-relaxed mb-6">
                      {selectedLesson.hook}
                    </Text>

                    {/* Stats */}
                    <View className="flex-row gap-3 mb-6">
                      <View className="bg-background rounded-pill px-3 py-1.5">
                        <Text className="text-secondary-text text-xs">
                          {selectedLesson.difficulty === 'beginner'
                            ? '🟢 Débutant'
                            : selectedLesson.difficulty === 'intermediate'
                            ? '🟡 Intermédiaire'
                            : '🔴 Avancé'}
                        </Text>
                      </View>
                      <View className="bg-background rounded-pill px-3 py-1.5">
                        <Text className="text-secondary-text text-xs">
                          ⏱️ {selectedLesson.duration} min
                        </Text>
                      </View>
                      <View className="bg-brand/10 rounded-pill px-3 py-1.5">
                        <Text className="text-brand text-xs font-semibold">
                          ⭐ {selectedLesson.xp} XP
                        </Text>
                      </View>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                      onPress={handleAction}
                      disabled={selectedLesson.status === 'locked'}
                      className={`rounded-button py-4 items-center ${
                        selectedLesson.status === 'locked'
                          ? 'bg-secondary-text/20'
                          : selectedLesson.status === 'completed'
                          ? 'bg-sage-green'
                          : 'bg-brand'
                      }`}
                    >
                      <Text
                        className={`font-semibold text-base ${
                          selectedLesson.status === 'locked'
                            ? 'text-secondary-text'
                            : 'text-white'
                        }`}
                      >
                        {selectedLesson.status === 'locked'
                          ? 'Terminez les leçons précédentes'
                          : selectedLesson.status === 'completed'
                          ? 'Refaire'
                          : 'Commencer'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScreenContainer>
  );
}
