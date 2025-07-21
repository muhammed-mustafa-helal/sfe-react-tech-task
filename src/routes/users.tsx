import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth";
import { Button } from "@/components/ui/button";
import { createProtectedRoute } from "../lib/auth-guard";
import { useUsers } from "../hooks/useUsers";
import { UsersTable } from "@/components/UsersTable";
export const Route = createFileRoute("/users")({
  ...createProtectedRoute(),
  component: UsersListPage,
});

function UsersListPage() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { users, isLoading, error, deleteUser, isDeleting } = useUsers();

  const handleLogout = async () => {
    logout();
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate({
      to: "/login",
      search: { redirect: undefined },
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
      {isLoading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-destructive">{(error as Error).message}</p>
      ) : (
        <UsersTable users={users} onDelete={deleteUser} isDeleting={isDeleting} />
      )}
    </div>
  );
}
