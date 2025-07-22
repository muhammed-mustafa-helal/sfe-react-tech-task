import { createFileRoute } from "@tanstack/react-router";
import { createAdminRoute } from "../../lib/auth-guard";
import { UsersTable } from "@/components/UsersTable";

export const Route = createFileRoute('/users/')({
  ...createAdminRoute(),
  component: UsersListPage,
});

function UsersListPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      <UsersTable />
    </div>
  );
}
