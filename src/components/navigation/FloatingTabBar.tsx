import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { COLORS } from '@/src/constants/theme';

const tabs = [
  { name: 'home' as const, label: 'Accueil', icon: 'home' as const },
  { name: 'explore' as const, label: 'Explorer', icon: 'compass' as const },
  { name: 'progress' as const, label: 'Progrès', icon: 'bar-chart' as const },
  { name: 'profile' as const, label: 'Profil', icon: 'user' as const },
];

export function FloatingTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 px-6 z-50"
      style={{ paddingBottom: Math.max(insets.bottom, 16) + 16 }}
      pointerEvents="box-none"
    >
      <View
        className="flex-row items-center justify-between rounded-pill px-5 py-3"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.04)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 24,
          elevation: 10,
        }}
      >
        {tabs.map((tab) => {
          const routeIndex = state.routes.findIndex((r: any) => r.name === tab.name);
          const isActive = routeIndex === state.index;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => {
                if (!isActive) {
                  navigation.navigate(tab.name);
                }
              }}
              className="items-center justify-center px-3 py-1 min-w-[60px]"
              activeOpacity={0.7}
            >
              <View
                className="w-11 h-11 rounded-full items-center justify-center mb-1.5"
                style={{
                  backgroundColor: isActive ? `${COLORS.brand}14` : 'transparent',
                }}
              >
                <FontAwesome
                  name={tab.icon}
                  size={22}
                  color={isActive ? COLORS.brand : COLORS.text.secondary}
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <View
                  className="h-[3px] rounded-full"
                  style={{
                    width: isActive ? 20 : 0,
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
