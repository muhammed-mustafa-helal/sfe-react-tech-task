import { useMutation } from "@tanstack/react-query";
import { useUsersStore } from "../store/users";
import { useAuthStore } from "../store/auth";

export function useUserDelete() {
  const { users, setUsers } = useUsersStore();
  const token = useAuthStore((s) => s.token);

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
      setUsers(users.filter((user) => user.id !== deletedId));
    },
  });

  return {
    deleteUser: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
} 