import { useAuthStore } from '../store/auth';

export function useIsAdmin(): boolean {
  const authenticatedUser = useAuthStore((s) => s.authenticatedUser);
  return !!authenticatedUser && authenticatedUser.role === 'admin';
} 