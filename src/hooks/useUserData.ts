import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/src/services/supabase';
import { useAuthStore } from '@/src/store/authStore';

interface Profile {
  id: string;
  username: string | null;
  level: number;
  xp: number;
  streak: number;
  max_streak: number;
  last_lesson_date: string | null;
  created_at: string;
}

interface UserProgress {
  completedLessons: string[];
  achievements: string[];
  totalLessons: number;
  totalLearningTime: number;
}

export function useUserProfile() {
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: supaError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (supaError) throw supaError;
      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}

export function useUserProgress() {
  const user = useAuthStore((state) => state.user);
  const [progress, setProgress] = useState<UserProgress>({
    completedLessons: [],
    achievements: [],
    totalLessons: 0,
    totalLearningTime: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgress({ completedLessons: [], achievements: [], totalLessons: 0, totalLearningTime: 0 });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch completed lessons
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (progressError) throw progressError;

      // Fetch achievements
      const { data: achievementData, error: achievementError } = await supabase
        .from('user_achievements')
        .select('achievement_id, achievements(slug)')
        .eq('user_id', user.id);

      if (achievementError) throw achievementError;

      // Calculate total time from completed lessons
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('estimated_time')
        .in('id', progressData?.map((p) => p.lesson_id) || []);

      const totalTime = lessonsData?.reduce((sum, l) => sum + (l.estimated_time || 0), 0) || 0;

      setProgress({
        completedLessons: progressData?.map((p) => p.lesson_id) || [],
        achievements: achievementData?.map((a: any) => a.achievements?.slug).filter(Boolean) || [],
        totalLessons: progressData?.length || 0,
        totalLearningTime: totalTime,
      });
    } catch (err: any) {
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, refetch: fetchProgress };
}
