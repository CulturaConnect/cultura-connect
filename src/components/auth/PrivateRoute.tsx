import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { getToken, isTokenExpired } from '@/utils/auth';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const { signed } = useAuth();
  const token = getToken();

  if (!signed || !token || isTokenExpired(token)) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}
