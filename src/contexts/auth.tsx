import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken, removeToken, isTokenExpired } from '@/utils/auth';

import { forgotPassword, login } from '@/services/auth';
import api from '@/lib/api';

export interface AuthUser {
  id: string;
  tipo: string;
  email: string;
  nome: string;
  telefone: string;
  cnpj: string | null;
  isMei: boolean;
  cpf: string | null;
  inscricaoEstadual: string | null;
  inscricaoMunicipal: string | null;
  imagemUrl: string | null;
}

interface AuthContextData {
  signed: boolean;
  user: AuthUser | null;
  Login(user: object): Promise<void>;
  Logout(): void;
  forgotPasswordSend(email: string): Promise<boolean>;
  updateUser(userData: AuthUser): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storagedUser = localStorage.getItem('@App:user');
    const storagedToken = getToken();

    if (storagedToken && storagedUser && !isTokenExpired(storagedToken)) {
      setUser(JSON.parse(storagedUser));
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
    } else if (storagedToken) {
      Logout();
    }
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          Logout();
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = getToken();
      if (token && isTokenExpired(token)) {
        Logout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  async function Login(userData: object) {
    const response = await login(userData);

    setUser(response.user);
    api.defaults.headers.Authorization = `Bearer ${response.token}`;

    localStorage.setItem('@App:user', JSON.stringify(response.user));
    setToken(response.token);
  }

  function updateUser(userData: AuthUser) {
    setUser(userData);
    localStorage.setItem('@App:user', JSON.stringify(userData));
  }

  async function forgotPasswordSend(email: string) {
    const res = await forgotPassword(email);

    if (res.error) {
      throw new Error(res.error);
    }

    return true;
  }

  function Logout() {
    setUser(null);
    removeToken();
    localStorage.removeItem('@App:user');
    delete api.defaults.headers.Authorization;
    navigate('/auth/login');
  }

  return (
    <AuthContext.Provider
      value={{
        signed: Boolean(user),
        user,
        Login,
        Logout,
        forgotPasswordSend,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
