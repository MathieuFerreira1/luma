import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '@/src/components/layout/ScreenContainer';
import { SectionTitle } from '@/src/components/text/SectionTitle';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const categories = [
  { id: 'sleep', name: 'Sommeil', icon: 'moon-o', color: '#AFCBFF', progress: 32 },
  { id: 'nutrition', name: 'Nutrition', icon: 'apple', color: '#9DB8A1', progress: 18 },
  { id: 'brain', name: 'Cerveau & Énergie', icon: 'bolt', color: '#F4C95D', progress: 24 },
  { id: 'movement', name: 'Mouvement', icon: 'heartbeat', color: '#E8A87C', progress: 0 },
  { id: 'longevity', name: 'Longévité', icon: 'leaf', color: '#B8A9C9', progress: 0 },
];

export default function ExploreScreen() {
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
          
          <View className="gap-4 mb-8">
            {categories.map((category) => (
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
                      {category.progress > 0 ? `${category.progress}% complété` : 'À découvrir'}
                    </Text>
                  </View>
                  <FontAwesome name="chevron-right" size={16} color="#667085" />
                </View>
                
                {category.progress > 0 && (
                  <View className="h-1.5 bg-background rounded-full mt-3 overflow-hidden">
                    <View 
                      className="h-full rounded-full" 
                      style={{ width: `${category.progress}%`, backgroundColor: category.color }}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>

          <SectionTitle>Découvertes</SectionTitle>
          
          <View className="flex-row gap-3 pb-8">
            <View className="bg-white rounded-card p-4 shadow-card flex-1">
              <Text className="text-primary-text font-semibold mb-1">Dopamine</Text>
              <Text className="text-secondary-text text-xs">Comment fonctionne le plaisir</Text>
            </View>
            <View className="bg-white rounded-card p-4 shadow-card flex-1">
              <Text className="text-primary-text font-semibold mb-1">Sommeil profond</Text>
              <Text className="text-secondary-text text-xs">Les cycles du sommeil</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}
