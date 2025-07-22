import { createRootRoute, Outlet, redirect, useLocation } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth';
import { NavBar } from '@/components/NavBar';

function RootLayout() {
  const location = useLocation();
  const showNavBar = location.pathname !== '/login';
  return (
    <>
      {showNavBar && <NavBar />}
      <Outlet />
    </>
  );
}

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
  component: RootLayout,
});
