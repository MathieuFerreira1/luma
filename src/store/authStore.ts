import { create } from 'zustand';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
}

interface User {
  id: string;
  email: string;
  username?: string;
}

interface Session {
  access_token: string;
  refresh_token: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // TODO: Connecter Supabase Auth ici
      console.log('Login attempt:', email);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // TODO: Déconnecter Supabase Auth ici
      set({ user: null, session: null });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setSession: (session: Session | null) => set({ session }),
  setUser: (user: User | null) => set({ user }),
}));
