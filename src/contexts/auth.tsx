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
  razaoSocial: string | null;
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
      const parsetStoragedUser = JSON.parse(storagedUser);
      const user = parsetStoragedUser.user || parsetStoragedUser;
      const {
        type,
        nome_completo,
        imagem_url,
        inscricao_estadual,
        inscricao_municipal,
        is_mei,
        razao_social,
        ...rest
      } = user;
      setUser({
        ...rest,
        nome: nome_completo || user.nome || '',
        tipo: type || parsetStoragedUser.tipo || 'person',
        imagemUrl: imagem_url || user.imagem_url || null,
        inscricaoEstadual:
          inscricao_estadual || user.inscricao_estadual || null,
        inscricaoMunicipal:
          inscricao_municipal || user.inscricao_municipal || null,

        isMei: is_mei || user.is_mei || false,
        razaoSocial: razao_social || user.razao_social || null,
      });
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateUser(userData: any) {
    setUser({
      ...user,

      imagemUrl: userData.imagem_url || user?.imagemUrl || null,
      inscricaoEstadual:
        userData.inscricao_estadual || user?.inscricaoEstadual || null,
      inscricaoMunicipal:
        userData.inscricao_municipal || user?.inscricaoMunicipal || null,
      isMei: userData.is_mei || user?.isMei || false,
      razaoSocial: userData.razao_social || user?.nome || null,
      telefone: userData.telefone || user?.telefone || '',
    });
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
