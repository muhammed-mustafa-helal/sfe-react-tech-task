import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUsersStore } from "../store/users";
import { useAuthStore } from "../store/auth";

export function useUsers() {
  const { setUsers, activeUsers } = useUsersStore();
  const token = useAuthStore((s) => s.token);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  useEffect(() => {
    if (data) setUsers(data);
  }, [data, setUsers]);

  return {
    users: activeUsers(),
    isLoading,
    error,
  };
} 