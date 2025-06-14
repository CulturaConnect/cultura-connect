import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { Login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await Login({ email, senha: password });

    setLoading(false);
  };

  return (
    <div className="animate-slide-up flex flex-col items-center w-full max-w-5xl">
      <Logo />

      <div className="rounded-3xl p-6 w-full mt-4">
        <div className="text-center mb-6 border-b">
          <h2 className="text-2xl font-normal text-gray-800 mb-2">Acesso</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="text-left">
            <button
              type="button"
              onClick={() => navigate('/auth/recover')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Esqueci minha senha
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm hover:opacity-90 text-white font-medium text-lg"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <button
              onClick={() => navigate('/auth/register-type')}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Cadastre-se agora!
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
