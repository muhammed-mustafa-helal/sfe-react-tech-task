import { useQuery, useMutation } from "@tanstack/react-query";
import { useUsersStore } from "../store/users";
import { useAuthStore } from "../store/auth";
import type { User } from "../store/users";

export function useUserUpdate(userId: number) {
  const { users, setUsers } = useUsersStore();
  const token = useAuthStore((s) => s.token);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const users = await res.json();
      const foundUser = users.find((user: User) => user.id === userId);
      if (!foundUser) throw new Error("User not found");
      return foundUser;
    },
    enabled: !!userId,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message === "User not found") {
        return false;
      }
      return failureCount < 3;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedFields: Partial<{ username: string; password: string; role: string }>) => {
      const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update user");
      }
      return res.json();
    },
    onSuccess: (updatedUser) => {
      setUsers(users.map((user: User) => (user.id === updatedUser.id ? updatedUser : user)));
    },
  });

  return {
    user,
    isLoading,
    error,
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
} 