import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth";
import { Button } from "@/components/ui/button";
import { createProtectedRoute } from "../lib/auth-guard";
import { useQuery } from "@tanstack/react-query";
import { useUsersStore } from "../store/users";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/users")({
  ...createProtectedRoute(),
  component: UsersListPage,
});

function UsersListPage() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { users, setUsers } = useUsersStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  useEffect(() => {
    if (data) setUsers(data);
  }, [data, setUsers]);

  const handleLogout = async () => {
    logout();
    // Small delay to ensure localStorage is cleared
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate({
      to: "/login",
      search: { redirect: undefined },
    });
  };

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[50px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
