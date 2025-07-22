import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { createProtectedRoute } from '../../lib/auth-guard';
import { UserCreateForm } from '@/components/UserCreateForm';

export const Route = createFileRoute('/users/create')({
  ...createProtectedRoute(),
  component: UserCreatePage,
});

function UserCreatePage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>
      <UserCreateForm onSuccess={() => navigate({ to: '/users', params: {} })} />
    </div>
  );
}
