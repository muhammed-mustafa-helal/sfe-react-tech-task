import { userUpdateSchema } from '../lib/validation';
import { useUserUpdate } from '../hooks/useUserUpdate';
import { GenericForm } from './GenericForm';
import type { FormField } from './GenericForm';

interface UserUpdateFormProps {
  userId: number;
}

export function UserUpdateForm({ userId }: UserUpdateFormProps) {
  const { user, isLoading, error, updateUser, isUpdating } = useUserUpdate(userId);

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
      required: false,
      placeholder: 'Leave blank to keep current password',
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

  const onSubmit = async (values: { username: string; password?: string; role: string }) => {
    const updateFields: Record<string, unknown> = {};
    if (values.username !== user?.username) updateFields.username = values.username;
    if (values.password) updateFields.password = values.password;
    if (values.role !== user?.role) updateFields.role = values.role;
    updateUser(updateFields);
  };

  if (isLoading) return <p>Loading user...</p>;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;
  if (!user) return <p className="text-destructive">User not found</p>;

  return (
    <GenericForm
      type="update"
      schema={userUpdateSchema}
      defaultValues={{ username: '', password: '', role: '' }}
      fields={fields}
      onSubmit={onSubmit}
      isPending={isUpdating}
      error={error}
      initialData={user}
    />
  );
} 