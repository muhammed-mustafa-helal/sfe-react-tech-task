import { createFileRoute, useNavigate, useSearch, redirect } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth';
import { FormItem, FormLabel, FormField, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated();
    
    if (isAuthenticated) {
      throw redirect({
        to: '/users',
      });
    }
  },
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: search.redirect as string | undefined,
  }),
  component: LoginPage,
});

type LoginFormValues = {
  username: string;
  password: string;
};

function LoginPage() {
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();
  const search = useSearch({ from: '/login' });

  const methods = useForm<LoginFormValues>({
    defaultValues: { username: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Login failed');
      }
      return res.json();
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
      const data = await loginMutation.mutateAsync(values);
      setToken(data.token);
      const redirectTo = search.redirect || '/users';
      navigate({ to: redirectTo as any });
  
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
            <FormField
              name="username"
              control={methods.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input id="username" {...field} required autoFocus />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={methods.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input id="password" type="password" {...field} required />
                  <FormMessage />
                </FormItem>
              )}
            />
            {loginMutation.error && (
              <div className="text-destructive text-sm">
                {loginMutation.error.message}
              </div>
            )}
            <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
