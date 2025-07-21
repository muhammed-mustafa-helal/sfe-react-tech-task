import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth';

export const Route = createFileRoute('/_layout')({
  beforeLoad: async ({ location }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated();
    
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          // Store the current location to redirect back after login
          redirect: location.href,
        },
      });
    }
  },
  component: () => <Outlet />,
});
