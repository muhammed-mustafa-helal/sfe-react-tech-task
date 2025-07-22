import { redirect } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth';

export function requireAuth(location: { href: string }) {
  const isAuthenticated = useAuthStore.getState().isAuthenticated();
  if (!isAuthenticated) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    });
  }
}

export function isAuthenticated(): boolean {
  return useAuthStore.getState().isAuthenticated();
}

export function createProtectedRoute() {
  return {
    beforeLoad: async ({ location }: { location: { href: string } }) => {
      requireAuth(location);
    },
  };
}

export function requireAdmin() {
  const user = useAuthStore.getState().authenticatedUser;
  if (!user || user.role !== 'admin') {
    throw redirect({ to: '/' });
  }
}

export function createAdminRoute() {
  return {
    beforeLoad: async () => {
      requireAdmin();
    },
  };
} 