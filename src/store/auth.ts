import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  authenticatedUser: { id: number; username: string; role: string } | null;
  setAuth: (token: string | null, authenticatedUser: { id: number; username: string; role: string } | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get, api) => ({
      token: null,
      authenticatedUser: null,
      setAuth: (token, authenticatedUser) => set({ token, authenticatedUser }),
      logout: () => {
        set({ token: null, authenticatedUser: null });
        api.persist.clearStorage();
        localStorage.removeItem('auth-storage');
      },
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
