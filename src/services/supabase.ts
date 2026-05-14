import 'react-native-url-polyfill/auto';
import { createClient, User, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing. Check your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: AsyncStorage as any,
  },
});

export type { User, Session };

// Types pour les tables Supabase
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          level: number;
          xp: number;
          streak: number;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          level?: number;
          xp?: number;
          streak?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          level?: number;
          xp?: number;
          streak?: number;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          color: string;
          description: string | null;
        };
      };
      lessons: {
        Row: {
          id: string;
          category_id: string;
          title: string;
          hook: string;
          description: string;
          difficulty: string;
          xp_reward: number;
          order_index: number;
          estimated_time: number;
          blocks: any[];
        };
      };
      quizzes: {
        Row: {
          id: string;
          lesson_id: string;
          question: string;
          options: string[];
          correct_answer: number;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          completed_at: string | null;
          xp_earned: number;
        };
      };
    };
  };
};
