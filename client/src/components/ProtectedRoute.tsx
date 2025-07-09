import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export const ProtectedRoute = ({ children, redirectPath = '/' }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center">
      <div>Loading...</div>
    </div>;
  }

  if (!isAuthenticated) {
    setLocation(redirectPath);
    return null;
  }

  return <>{children}</>;
};
