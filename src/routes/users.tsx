import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth';
import { Button } from '@/components/ui/button';
import { createProtectedRoute } from '../lib/auth-guard';

export const Route = createFileRoute('/users')({
  ...createProtectedRoute(),
  component: UsersListPage,
});

function UsersListPage() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    // Small delay to ensure localStorage is cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    navigate({ 
      to: '/login',
      search: { redirect: undefined }
    });
  };

  // TODO: Fetch users from API using TanStack Query
  // TODO: Display users in a table using shadcn/ui components
  // TODO: Add actions for edit and delete
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
      <p className="text-muted-foreground">Users list coming soon...</p>
    </div>
  );
}
