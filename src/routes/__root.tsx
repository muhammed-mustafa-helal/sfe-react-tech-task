import { createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth';

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/') {
      const isAuthenticated = useAuthStore.getState().isAuthenticated();
      
      if (!isAuthenticated) {
        throw redirect({
          to: '/login',
          search: { redirect: undefined }
        });
      }
    }
  },
  component: () => <Outlet />,
});
