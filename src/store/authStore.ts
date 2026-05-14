import { create } from 'zustand';
import { supabase } from '@/src/services/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        set({ session, user: session.user, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user || null });
    });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      set({ 
        user: data.user, 
        session: data.session,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signup: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      set({ 
        user: data.user, 
        session: data.session,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null, isLoading: false });
    } catch (error: any) {
      console.error('Logout error:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
