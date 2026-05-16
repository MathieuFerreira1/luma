import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/src/constants/theme';

function TabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const tabData = [
    { name: 'home', label: 'Accueil', icon: 'home' },
    { name: 'explore', label: 'Explorer', icon: 'compass' },
    { name: 'progress', label: 'Progrès', icon: 'bar-chart' },
    { name: 'profile', label: 'Profil', icon: 'user' },
  ] as const;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: Math.max(insets.bottom, 12) + 12,
        paddingHorizontal: 20,
        zIndex: 50,
      }}
      pointerEvents="box-none"
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          borderRadius: 50,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.04)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 24,
          elevation: 12,
        }}
      >
        {tabData.map((tab) => {
          const index = state.routes.findIndex((r: any) => r.name === tab.name);
          const isActive = index === state.index;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => {
                if (!isActive) navigation.navigate(tab.name);
              }}
              style={{ alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4 }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 4,
                  backgroundColor: isActive ? `${COLORS.brand}14` : 'transparent',
                }}
              >
                <FontAwesome
                  name={tab.icon as any}
                  size={22}
                  color={isActive ? COLORS.brand : COLORS.text.secondary}
                  style={isActive ? { fontWeight: '700' } : undefined}
                />
              </View>
              <View style={{ alignItems: 'center', height: 3 }}>
                <View
                  style={{
                    width: isActive ? 16 : 0,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: COLORS.brand,
                    opacity: isActive ? 1 : 0,
                  }}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        animation: 'none',
      }}
      tabBar={TabBar}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
