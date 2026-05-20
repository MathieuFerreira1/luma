import { View, TouchableOpacity, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { COLORS } from '@/src/constants/theme';
import { router, usePathname } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';

const tabs = [
  { path: '/home', label: 'Accueil', icon: 'home' as const },
  { path: '/explore', label: 'Explorer', icon: 'compass' as const },
  { path: '/progress', label: 'Progrès', icon: 'bar-chart' as const },
  { path: '/profile', label: 'Profil', icon: 'user' as const },
];

export function TabBarCustom() {
  const pathname = usePathname();
  const [rowWidth, setRowWidth] = useState(0);
  const activeIndex = tabs.findIndex((t) => t.path === pathname);

  const translateX = useSharedValue(0);

  useEffect(() => {
    if (rowWidth > 0) {
      translateX.value = (rowWidth / tabs.length) * activeIndex;
    }
  }, [activeIndex, rowWidth, translateX]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(translateX.value, { damping: 18, stiffness: 200 }) }],
  }));

  const itemWidth = rowWidth > 0 ? rowWidth / tabs.length : 0;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: 16,
        zIndex: 50,
      }}
      pointerEvents="box-none"
    >
      <View
        style={{
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderRadius: 50,
          padding: 4,
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.04)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        {/* Row commune : pill overlay + buttons côte à côte */}
        <View
          onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
          style={{
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
        >
          {/* Pill qui glisse - EXACTEMENT comme le toggle Connexion/Inscription */}
          {rowWidth > 0 && (
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: itemWidth,
                  borderRadius: 40,
                  backgroundColor: `${COLORS.brand}12`,
                  zIndex: 0,
                },
                pillStyle,
              ]}
            />
          )}

          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            return (
              <TouchableOpacity
                key={tab.path}
                onPress={() => {
                  if (!isActive) {
                    router.replace(tab.path);
                  }
                }}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 10,
                  zIndex: 1,
                }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 2,
                  }}
                >
                  <FontAwesome
                    name={tab.icon}
                    size={16}
                    color={isActive ? COLORS.brand : COLORS.text.secondary}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 8,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    color: isActive ? COLORS.brand : COLORS.text.secondary,
                    opacity: isActive ? 1 : 0.45,
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
