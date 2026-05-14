import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/store/authStore';
import { useUserProfile } from '@/src/hooks/useUserData';
import { ScreenContainer } from '@/src/components/layout/ScreenContainer';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { profile } = useUserProfile();

  const email = user?.email || '';
  const displayName = profile?.username || email.split('@')[0] || 'Explorateur';
  const level = profile?.level || 1;
  const xp = profile?.xp || 0;
  const streak = profile?.streak || 0;

  const levelTitle = level <= 3 ? 'Explorateur' : level <= 6 ? 'Curieux' : 'Passionné';

  const handleLogout = async () => {
    await logout();
  };

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
              <Text className="text-primary-text text-xl font-bold">{displayName}</Text>
              <Text className="text-secondary-text text-sm">{email}</Text>
              <Text className="text-secondary-text text-sm mt-1">
                Niveau {level} — {levelTitle}
              </Text>

              <View className="flex-row gap-4 mt-4">
                <View className="bg-background rounded-pill px-4 py-2">
                  <Text className="text-primary-text text-sm font-medium">
                    🔥 {streak} jours
                  </Text>
                </View>
                <View className="bg-background rounded-pill px-4 py-2">
                  <Text className="text-primary-text text-sm font-medium">
                    ⭐ {xp} XP
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Settings */}
          <View className="mb-6">
            <Text className="text-primary-text text-lg font-semibold mb-3">
              Compte
            </Text>
            <View className="bg-white rounded-card shadow-card overflow-hidden">
              <View className="flex-row items-center px-4 py-3.5 border-b border-background">
                <FontAwesome name="user" size={18} color="#667085" />
                <Text className="text-primary-text text-base ml-3 flex-1">Modifier le profil</Text>
                <FontAwesome name="chevron-right" size={14} color="#667085" />
              </View>
              <View className="flex-row items-center px-4 py-3.5 border-b border-background">
                <FontAwesome name="bell" size={18} color="#667085" />
                <Text className="text-primary-text text-base ml-3 flex-1">Notifications</Text>
                <FontAwesome name="chevron-right" size={14} color="#667085" />
              </View>
              <View className="flex-row items-center px-4 py-3.5">
                <FontAwesome name="lock" size={18} color="#667085" />
                <Text className="text-primary-text text-base ml-3 flex-1">Confidentialité</Text>
                <FontAwesome name="chevron-right" size={14} color="#667085" />
              </View>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-primary-text text-lg font-semibold mb-3">
              Application
            </Text>
            <View className="bg-white rounded-card shadow-card overflow-hidden">
              <View className="flex-row items-center px-4 py-3.5 border-b border-background">
                <FontAwesome name="moon-o" size={18} color="#667085" />
                <Text className="text-primary-text text-base ml-3 flex-1">Mode sombre</Text>
                <FontAwesome name="chevron-right" size={14} color="#667085" />
              </View>
              <View className="flex-row items-center px-4 py-3.5 border-b border-background">
                <FontAwesome name="globe" size={18} color="#667085" />
                <Text className="text-primary-text text-base ml-3 flex-1">Langue</Text>
                <FontAwesome name="chevron-right" size={14} color="#667085" />
              </View>
              <View className="flex-row items-center px-4 py-3.5">
                <FontAwesome name="info-circle" size={18} color="#667085" />
                <Text className="text-primary-text text-base ml-3 flex-1">À propos</Text>
                <FontAwesome name="chevron-right" size={14} color="#667085" />
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-red-50 rounded-card py-4 px-6 mb-8 items-center border border-red-100"
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text className="text-red-500 font-semibold text-base">
              Se déconnecter
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
}
