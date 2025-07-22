import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../lib/validation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { useLogin } from '../hooks/useLogin';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
    mode: 'onChange',
  });
  const loginMutation = useLogin();

  const onSubmit = async (values: { username: string; password: string }) => {
    await loginMutation.mutateAsync(values);
    if (!loginMutation.error) onSuccess();
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField
          name="username"
          control={methods.control}
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel htmlFor="username">
                Username <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input id="username" {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={methods.control}
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel htmlFor="password">
                Password <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input id="password" type="password" {...field} />
              </FormControl>
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
  );
} 