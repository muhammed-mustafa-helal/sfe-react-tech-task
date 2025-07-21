import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormItem, FormLabel, FormMessage, FormField, FormControl } from '@/components/ui/form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

import { useUsersStore } from '../store/users';
import { useAuthStore } from '../store/auth';
import { createProtectedRoute } from '../lib/auth-guard';

export const Route = createFileRoute('/users-create')({
  ...createProtectedRoute(),
  component: UserCreatePage,
});

type UserFormValues = {
  username: string;
  password: string;
  role: string;
};

function UserCreatePage() {
  const methods = useForm<UserFormValues>({
    defaultValues: { username: '', password: '', role: '' },
    mode: 'onChange',
  });
  const navigate = useNavigate();
  const { users, setUsers } = useUsersStore();
  const token = useAuthStore((s) => s.token);

  const mutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      const res = await fetch('http://localhost:3000/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to create user');
      }
      return res.json();
    },
    onSuccess: (newUser) => {
      setUsers([...users, newUser]);
      navigate({ to: '/users' });
    },
  });

  const onSubmit = (values: UserFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>
      <FormProvider {...methods}>
        <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
          <FormField
            control={methods.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username">
                  Username<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="username"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            rules={{
              required: "Username is required",
              minLength: {
                value: 5,
                message: "Username must be 5 characters or more",
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "Username can't contain special characters",
              },
              validate: {
                notStartWithNumber: v => !/^[0-9]/.test(v) || "Username cannot start with a number",
                noTest: v => !/test/i.test(v) || "Username must be a real name",
              },
            }}
          />
          <FormField
            control={methods.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">
                  Password<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            }}
          />
          <FormField
            control={methods.control}
            name="role"
            rules={{ required: "Role is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="role">Role</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {mutation.error && <div className="text-destructive text-sm">{mutation.error.message}</div>}
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
