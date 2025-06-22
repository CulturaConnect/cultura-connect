import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { getToken, isTokenExpired } from '@/utils/auth';
import SplashScreen from './SplashScreen';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const { signed } = useAuth();
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signed || !token || isTokenExpired(token)) {
      const t = setTimeout(() => {
        navigate('/auth/login', { replace: true });
      }, 500);

      return () => clearTimeout(t);
    }
  }, [signed, token, navigate]);

  if (!signed || !token || isTokenExpired(token)) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
