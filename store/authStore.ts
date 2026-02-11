import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authAPI } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'guest' | 'staff' | 'admin';
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setAuth: (user: User, token: string) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });
          const { user, token } = response.data.data;
          
          set({ user, token, isLoading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(data);
          const { user, token } = response.data.data;
          
          set({ user, token, isLoading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      clearError: () => set({ error: null }),

      setAuth: (user: User, token: string) => {
        set({ user, token, isLoading: false, error: null });
      },

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
