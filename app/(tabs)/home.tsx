import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '@/src/components/layout/ScreenContainer';
import { SectionTitle } from '@/src/components/text/SectionTitle';

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <SafeAreaView className="flex-1 px-6">
        {/* Top Bar */}
        <View className="flex-row justify-between items-center mt-2 mb-6">
          <View>
            <Text className="text-secondary-text text-sm font-medium">Bonjour</Text>
            <Text className="text-primary-text text-xl font-semibold">Émilie</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="bg-white rounded-full px-3 py-1.5 shadow-card">
              <Text className="text-brand text-sm font-semibold">🔥 3</Text>
            </View>
            <View className="bg-white rounded-full px-3 py-1.5 shadow-card">
              <Text className="text-brand text-sm font-semibold">⭐ Niv. 2</Text>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <SectionTitle>Votre découverte du jour</SectionTitle>

        {/* Hero Lesson Card - Placeholder */}
        <View className="bg-white rounded-card p-6 shadow-card mb-8">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="bg-sleep-blue/30 rounded-pill px-3 py-1">
              <Text className="text-primary-text text-xs font-medium">Sommeil</Text>
            </View>
            <Text className="text-secondary-text text-xs">3 min</Text>
          </View>
          
          <Text className="text-primary-text text-xl font-bold mb-2 leading-tight">
            Pourquoi la lumière influence votre énergie
          </Text>
          <Text className="text-secondary-text text-sm mb-4 leading-relaxed">
            Votre cerveau utilise la lumière pour réguler votre énergie. Découvrez comment
          </Text>
          
          <View className="bg-brand rounded-button py-3 px-6 items-center">
            <Text className="text-white font-semibold text-base">
              Découvrir la leçon
            </Text>
          </View>
        </View>

        {/* Progress Section */}
        <SectionTitle>Vos progrès</SectionTitle>
        
        <View className="gap-3">
          <View className="bg-white rounded-card p-4 shadow-card">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-primary-text font-medium">Sommeil</Text>
              <Text className="text-brand font-semibold">32%</Text>
            </View>
            <View className="h-2 bg-background rounded-full overflow-hidden">
              <View className="h-full bg-sleep-blue rounded-full" style={{ width: '32%' }} />
            </View>
          </View>

          <View className="bg-white rounded-card p-4 shadow-card">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-primary-text font-medium">Nutrition</Text>
              <Text className="text-brand font-semibold">18%</Text>
            </View>
            <View className="h-2 bg-background rounded-full overflow-hidden">
              <View className="h-full bg-sage-green rounded-full" style={{ width: '18%' }} />
            </View>
          </View>

          <View className="bg-white rounded-card p-4 shadow-card">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-primary-text font-medium">Cerveau & Énergie</Text>
              <Text className="text-brand font-semibold">24%</Text>
            </View>
            <View className="h-2 bg-background rounded-full overflow-hidden">
              <View className="h-full bg-accent-yellow rounded-full" style={{ width: '24%' }} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScreenContainer>
  );
}
