import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import { useAuthStore } from '@/src/store/authStore';
import '@/global.css';

// Sur le web, importe le CSS compilé manuellement
if (Platform.OS === 'web') {
  require('../assets/styles.css');
}

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
