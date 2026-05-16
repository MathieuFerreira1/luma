import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { COLORS } from '@/src/constants/theme';

interface LessonCardProps {
  id: string;
  title: string;
  category: string;
  duration: number;
  categoryColor?: string;
  difficulty?: string;
  description?: string;
}

export function LessonCard({
  id,
  title,
  category,
  duration,
  categoryColor = COLORS.brand,
  difficulty = 'Débutant',
  description,
}: LessonCardProps) {
  return (
    <Link href={`/lesson/${id}`} asChild>
      <TouchableOpacity className="bg-card rounded-card p-5 shadow-card active:opacity-90">
        <View className="flex-row items-center gap-2 mb-3">
          <View
            className="rounded-pill px-3 py-1"
            style={{ backgroundColor: `${categoryColor}30` }}
          >
            <Text className="text-primary-text text-xs font-medium">{category}</Text>
          </View>
          <Text className="text-secondary-text text-xs">{duration} min</Text>
        </View>

        <Text className="text-primary-text text-lg font-bold mb-2 leading-tight">
          {title}
        </Text>

        {description && (
          <Text className="text-secondary-text text-sm leading-relaxed mb-3">
            {description}
          </Text>
        )}

        <Text className="text-brand text-sm font-medium">Commencer →</Text>
      </TouchableOpacity>
    </Link>
  );
}

export function CategoryCard({
  name,
  icon,
  color,
  progress,
}: {
  name: string;
  icon: string;
  color: string;
  progress: number;
}) {
  return (
    <TouchableOpacity className="bg-card rounded-card p-5 shadow-card active:opacity-90">
      <View className="flex-row items-center gap-4">
        <View
          className="w-12 h-12 rounded-button items-center justify-center"
          style={{ backgroundColor: `${color}30` }}
        >
          <Text style={{ color }} className="text-2xl">
            ●
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-primary-text text-base font-semibold">{name}</Text>
          <Text className="text-secondary-text text-sm">
            {progress > 0 ? `${progress}% complété` : 'À découvrir'}
          </Text>
        </View>
      </View>
      {progress > 0 && (
        <View className="h-1.5 bg-background rounded-full mt-3 overflow-hidden">
          <View className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: color }} />
        </View>
      )}
    </TouchableOpacity>
  );
}
