import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  const loginMutation = useMutation({
    mutationFn: async (values: { username: string; password: string }) => {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Login failed');
      }
      return res.json();
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });

  return loginMutation;
} 