import { useMutation } from '@tanstack/react-query';
import { useUsersStore } from '../store/users';
import { useAuthStore } from '../store/auth';

export function useUserCreate() {
  const { users, setUsers } = useUsersStore();
  const token = useAuthStore((s) => s.token);

  const mutation = useMutation({
    mutationFn: async (values: { username: string; password: string; role: string }) => {
      const res = await fetch('http://localhost:3000/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to create user');
      }
      return res.json();
    },
    onSuccess: (newUser) => {
      setUsers([...users, newUser]);
    },
  });

  return mutation;
} 