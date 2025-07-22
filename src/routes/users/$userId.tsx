import { createFileRoute } from '@tanstack/react-router';
import { createProtectedRoute } from '../../lib/auth-guard';
import { UserUpdateForm } from '@/components/UserUpdateForm';
import { useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/users/$userId')({
  ...createProtectedRoute(),
  component: UserEditPage,
});

function UserEditPage() {
  const { userId } = useParams({ from: '/users/$userId' });
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      <UserUpdateForm userId={Number(userId)} />
    </div>
  );
}
