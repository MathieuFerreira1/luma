import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '@/src/components/layout/ScreenContainer';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const settingsSections = [
  { id: 'account', title: 'Compte', items: [
    { icon: 'user', label: 'Modifier le profil' },
    { icon: 'bell', label: 'Notifications' },
    { icon: 'lock', label: 'Confidentialité' },
  ]},
  { id: 'app', title: 'Application', items: [
    { icon: 'moon-o', label: 'Mode sombre' },
    { icon: 'globe', label: 'Langue' },
    { icon: 'info-circle', label: 'À propos' },
  ]},
];

export default function ProfileScreen() {
  return (
    <ScreenContainer>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <Text className="text-primary-text text-2xl font-bold mt-2 mb-6">
            Profil
          </Text>

          {/* Profile Header */}
          <View className="bg-white rounded-card p-6 shadow-card mb-8">
            <View className="items-center">
              <View className="w-20 h-20 bg-brand/10 rounded-full items-center justify-center mb-3">
                <FontAwesome name="user" size={36} color="#6E6AE8" />
              </View>
              <Text className="text-primary-text text-xl font-bold">Émilie</Text>
              <Text className="text-secondary-text text-sm">Niveau 2 — Explorateur</Text>
              
              <View className="flex-row gap-4 mt-4">
                <View className="bg-background rounded-pill px-4 py-2">
                  <Text className="text-primary-text text-sm font-medium">🔥 3 jours</Text>
                </View>
                <View className="bg-background rounded-pill px-4 py-2">
                  <Text className="text-primary-text text-sm font-medium">⭐ 145 XP</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Settings */}
          {settingsSections.map((section) => (
            <View key={section.id} className="mb-6">
              <Text className="text-primary-text text-lg font-semibold mb-3">
                {section.title}
              </Text>
              <View className="bg-white rounded-card shadow-card overflow-hidden">
                {section.items.map((item, index) => (
                  <View 
                    key={item.label}
                    className={`flex-row items-center px-4 py-3.5 ${
                      index < section.items.length - 1 ? 'border-b border-background' : ''
                    }`}
                  >
                    <FontAwesome name={item.icon as any} size={18} color="#667085" />
                    <Text className="text-primary-text text-base ml-3 flex-1">
                      {item.label}
                    </Text>
                    <FontAwesome name="chevron-right" size={14} color="#667085" />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}
