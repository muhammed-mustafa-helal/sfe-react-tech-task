import { createFileRoute, useNavigate, useSearch, redirect } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth';
import { LoginForm } from '@/components/LoginForm';

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated();
    if (isAuthenticated) {
      throw redirect({
        to: '/',
      });
    }
  },
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: search.redirect as string | undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/login' });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <LoginForm
          onSuccess={() => {
            const redirectTo = search.redirect || '/';
            navigate({ to: redirectTo as any });
          }}
        />
      </div>
    </div>
  );
}
