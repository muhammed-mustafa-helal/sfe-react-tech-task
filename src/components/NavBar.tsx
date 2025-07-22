import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '../store/auth';

export function NavBar() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const authenticatedUser = useAuthStore((s) => s.authenticatedUser);

  const handleLogout = async () => {
    logout();
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate({ to: '/login', search: { redirect: undefined } });
  };

  return (
    <nav className="w-full bg-white border-b shadow flex items-center justify-between px-8 py-3 mb-8">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-semibold text-lg hover:text-primary transition-colors">Homepage</Link>
        {authenticatedUser?.role === 'admin' && (
          <>
            <Link to="/users" className="font-semibold text-lg hover:text-primary transition-colors">Users</Link>
            <Link to="/users/create" className="font-semibold text-lg hover:text-primary transition-colors">Create User</Link>
          </>
        )}
      </div>
      <div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
} 