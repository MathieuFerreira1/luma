import { createClient } from '@supabase/supabase-js';

// TODO: Remplacer ces variables par les vôtres
// Vous trouverez ces informations dans votre dashboard Supabase :
// 1. Allez sur https://supabase.com/dashboard/project/[votre-project-ref]
// 2. Dans le menu latéral, cliquez sur "Settings" → "API"
// 3. Copiez le "URL" et le "anon public" key

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project-ref.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

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
          content: string;
          difficulty: string;
          xp_reward: number;
          order_index: number;
          estimated_time: number;
        };
      };
      quizzes: {
        Row: {
          id: string;
          lesson_id: string;
          question: string;
          answers: string[];
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
