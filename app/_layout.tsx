import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import '@/global.css';

// Sur le web, importe le CSS compilé manuellement
if (Platform.OS === 'web') {
  require('../assets/styles.css');
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
