import { useForm, FormProvider } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useUserCreate } from '../hooks/useUserCreate';

export function UserCreateForm() {
  const methods = useForm({
    defaultValues: { username: '', password: '', role: '' },
    mode: 'onChange',
  });
  const mutation = useUserCreate();

  const onSubmit = async (values: { username: string; password: string; role: string }) => {
    await mutation.mutateAsync(values);
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
        {methods.formState.isSubmitSuccessful && (
          <div className="mb-4 rounded-md bg-green-100 border border-green-300 text-green-800 px-4 py-2 text-center font-medium">
            User created successfully
          </div>
        )}
        <FormField
          control={methods.control}
          name="username"
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
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          }}
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
        <FormField
          control={methods.control}
          name="role"
          rules={{ required: "Role is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="role">
                Role <span className="text-destructive">*</span>
              </FormLabel>
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
  );
} 