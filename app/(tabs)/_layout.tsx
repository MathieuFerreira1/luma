import { Stack } from 'expo-router';
import { View } from 'react-native';
import { TabBarCustom } from '@/src/components/navigation/TabBarCustom';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="progress" />
        <Stack.Screen name="profile" />
      </Stack>
      <TabBarCustom />
    </View>
  );
}
