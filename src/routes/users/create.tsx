import { createFileRoute } from '@tanstack/react-router';
import { createAdminRoute } from '../../lib/auth-guard';
import { UserCreateForm } from '@/components/UserCreateForm';

export const Route = createFileRoute('/users/create')({
  ...createAdminRoute(),
  component: UserCreatePage,
});

function UserCreatePage() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>
      <UserCreateForm />
    </div>
  );
}
