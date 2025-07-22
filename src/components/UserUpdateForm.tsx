import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userUpdateSchema } from '../lib/validation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useUserUpdate } from '../hooks/useUserUpdate';

interface UserUpdateFormProps {
  userId: number;
}

export function UserUpdateForm({ userId }: UserUpdateFormProps) {
  const { user, isLoading, error, updateUser, isUpdating } = useUserUpdate(userId);
  const methods = useForm({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: { username: '', password: '', role: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      methods.reset({ username: user.username, password: '', role: user.role });
    }
  }, [user, methods]);

  const watched = methods.watch();

  const isAnyFieldChanged = user && (
    watched.username !== user.username ||
    (watched.password && watched.password.length > 0) ||
    watched.role !== user.role
  );

  const onSubmit = async (values: { username: string; password?: string; role: string }) => {
    const updateFields: any = {};
    if (values.username !== user?.username) updateFields.username = values.username;
    if (values.password) updateFields.password = values.password;
    if (values.role !== user?.role) updateFields.role = values.role;
    updateUser(updateFields);
  };

  if (isLoading) return <p>Loading user...</p>;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;
  if (!user) return <p className="text-destructive">User not found</p>;

  return (
    <FormProvider {...methods}>
      <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
        {methods.formState.isSubmitSuccessful && (
          <div className="mb-4 rounded-md bg-green-100 border border-green-300 text-green-800 px-4 py-2 text-center font-medium">
            User updated successfully
          </div>
        )}
        <FormField
          control={methods.control}
          name="username"
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
          control={methods.control}
          name="password"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel htmlFor="password">
                Password
              </FormLabel>
              <FormControl>
                <Input id="password" type="password" {...field} placeholder="Leave blank to keep current password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="role">Role</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || (user ? user.role : '')}
                >
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
        {isUpdating && <div className="text-muted-foreground text-sm">Updating...</div>}
        {error && <div className="text-destructive text-sm">{(error as Error).message}</div>}
        <Button type="submit" className="w-full" disabled={!isAnyFieldChanged || !methods.formState.isValid || isUpdating}>
          Update User
        </Button>
      </form>
    </FormProvider>
  );
} 