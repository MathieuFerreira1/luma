import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '@/src/components/layout/ScreenContainer';
import { SectionTitle } from '@/src/components/text/SectionTitle';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const achievements = [
  { id: '1', name: '7 jours de suite', icon: 'fire', unlocked: true },
  { id: '2', name: 'Explorateur Sommeil', icon: 'moon-o', unlocked: true },
  { id: '3', name: 'Quiz Parfait', icon: 'star', unlocked: false },
  { id: '4', name: '10 Leçons', icon: 'book', unlocked: false },
];

export default function ProgressScreen() {
  return (
    <ScreenContainer>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <Text className="text-primary-text text-2xl font-bold mt-2 mb-6">
            Progression
          </Text>

          {/* Hero Stats */}
          <View className="bg-white rounded-card p-6 shadow-card mb-8 items-center">
            <Text className="text-brand text-4xl font-bold mb-1">Niveau 2</Text>
            <Text className="text-secondary-text text-base mb-4">Explorateur</Text>
            
            <View className="w-full h-3 bg-background rounded-full overflow-hidden mb-2">
              <View className="h-full bg-brand rounded-full" style={{ width: '45%' }} />
            </View>
            <Text className="text-secondary-text text-sm">
              145 / 250 XP
            </Text>
          </View>

          {/* Stats */}
          <SectionTitle>Statistiques</SectionTitle>
          
          <View className="flex-row gap-3 mb-8">
            <View className="bg-white rounded-card p-4 shadow-card flex-1 items-center">
              <Text className="text-primary-text text-2xl font-bold">12</Text>
              <Text className="text-secondary-text text-xs mt-1">Leçons</Text>
            </View>
            <View className="bg-white rounded-card p-4 shadow-card flex-1 items-center">
              <Text className="text-primary-text text-2xl font-bold">36m</Text>
              <Text className="text-secondary-text text-xs mt-1">Apprentissage</Text>
            </View>
            <View className="bg-white rounded-card p-4 shadow-card flex-1 items-center">
              <Text className="text-primary-text text-2xl font-bold">3j</Text>
              <Text className="text-secondary-text text-xs mt-1">Série</Text>
            </View>
          </View>

          {/* Achievements */}
          <SectionTitle>Badges</SectionTitle>
          
          <View className="flex-row flex-wrap gap-3 pb-8">
            {achievements.map((achievement) => (
              <View 
                key={achievement.id}
                className={`bg-white rounded-card p-4 shadow-card items-center flex-1 min-w-[100px] ${
                  !achievement.unlocked ? 'opacity-50' : ''
                }`}
              >
                <FontAwesome 
                  name={achievement.icon as any} 
                  size={28} 
                  color={achievement.unlocked ? '#6E6AE8' : '#667085'} 
                />
                <Text className="text-primary-text text-xs font-medium mt-2 text-center">
                  {achievement.name}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}
