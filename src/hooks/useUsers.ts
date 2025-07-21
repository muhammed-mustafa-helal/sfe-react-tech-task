import { useQuery, useMutation } from "@tanstack/react-query";
import { useUsersStore } from "../store/users";
import { useAuthStore } from "../store/auth";
import { useEffect } from "react";

export function useUsers() {
  const { users, setUsers, activeUsers } = useUsersStore();
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

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deleted: true }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete user");
      }
      return id;
    },
    onSuccess: (deletedId) => {
      setUsers(users.filter((u) => u.id !== deletedId));
    },
  });

  return {
    users: activeUsers(),
    isLoading,
    error,
    deleteUser: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
} 