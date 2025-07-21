import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
      isAuthenticated: () => {
        const state = get();
        return !!state.token;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
