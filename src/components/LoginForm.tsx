import { loginSchema } from '../lib/validation';
import { useLogin } from '../hooks/useLogin';
import { GenericForm } from './GenericForm';
import type { FormField } from './GenericForm';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const loginMutation = useLogin();

  const fields: FormField[] = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
    },
  ];

  const onSubmit = async (values: { username: string; password: string }) => {
    await loginMutation.mutateAsync(values);
    if (!loginMutation.error) onSuccess();
  };

  return (
    <GenericForm
      type="login"
      schema={loginSchema}
      defaultValues={{ username: '', password: '' }}
      fields={fields}
      onSubmit={onSubmit}
      isPending={loginMutation.isPending}
      error={loginMutation.error}
    />
  );
} 