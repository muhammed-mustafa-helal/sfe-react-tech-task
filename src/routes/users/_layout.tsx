import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/users/_layout')({
  component: () => <Outlet />,
});
