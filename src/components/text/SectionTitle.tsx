import { Text } from 'react-native';

export function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="text-primary-text text-lg font-semibold mb-3">
      {children}
    </Text>
  );
}
