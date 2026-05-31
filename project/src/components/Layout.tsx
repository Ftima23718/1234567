import { Outlet, Navigate } from 'react-router-dom';
import Sidebar, { TopBar } from './Sidebar';
import { useAuth } from '../hooks/useAuthContext';

interface DashboardLayoutProps {
  requiredRole?: string;
}

export default function DashboardLayout({ requiredRole }: DashboardLayoutProps) {
  const { isAuthenticated, currentRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar role={currentRole as 'student' | 'admin' | 'responsible' | 'driver'} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
