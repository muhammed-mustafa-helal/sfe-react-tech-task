import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth';
import { Button } from '@/components/ui/button';
import { createProtectedRoute } from '../lib/auth-guard';
import { useQuery } from '@tanstack/react-query';
import { useUsersStore } from '../store/users';
import {useEffect} from 'react';

export const Route = createFileRoute('/users')({
  ...createProtectedRoute(),
  component: UsersListPage,
});

function UsersListPage() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { users, setUsers } = useUsersStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/users', {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
  });

  useEffect(() => {
    if (data) setUsers(data);
  }, [data, setUsers]);

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
      {isLoading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-destructive">{(error as Error).message}</p>
      ) : (
        <table className="min-w-full border text-left">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Username</th>
              <th className="border px-2 py-1">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-2 py-1">{user.id}</td>
                <td className="border px-2 py-1">{user.username}</td>
                <td className="border px-2 py-1">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
