import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';

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

  useEffect(() => {
    const storagedUser = sessionStorage.getItem('@App:user');
    const storagedToken = sessionStorage.getItem('@App:token');

    if (storagedToken && storagedUser) {
      setUser(JSON.parse(storagedUser));
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
    }
  }, []);

  async function Login(userData: object) {
    const response = await login(userData);

    setUser(response.user);
    api.defaults.headers.Authorization = `Bearer ${response.token}`;

    sessionStorage.setItem('@App:user', JSON.stringify(response.user));
    sessionStorage.setItem('@App:token', response.token);
  }

  function updateUser(userData: AuthUser) {
    setUser(userData);
    sessionStorage.setItem('@App:user', JSON.stringify(userData));
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
