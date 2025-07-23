import { userCreateSchema } from '../lib/validation';
import { useUserCreate } from '../hooks/useUserCreate';
import { GenericForm } from './GenericForm';
import type { FormField } from './GenericForm';

export function UserCreateForm() {
  const mutation = useUserCreate();

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
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      placeholder: 'Select a role',
      options: [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
      ],
    },
  ];

  const onSubmit = async (values: { username: string; password: string; role: string }) => {
    await mutation.mutateAsync(values);
  };

  return (
    <GenericForm
      type="create"
      schema={userCreateSchema}
      defaultValues={{ username: '', password: '', role: '' }}
      fields={fields}
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      error={mutation.error}
    />
  );
} 