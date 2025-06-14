import { Button } from '@/components/ui/button';
import { Building, User } from 'lucide-react';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';

const RegisterTypeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-slide-up flex flex-col items-center w-full max-w-5xl justify-between h-screen">
      <div className="w-full flex items-center justify-center flex-col flex-1">
        <Logo />

        <div className="w-full mt-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-2">
              Cadastro
            </h2>
            <p className="text-gray-600 text-sm">
              Selecione o tipo de cadastro
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={() => navigate('/auth/register/company')}
            >
              <Building size={20} />
              Empresa
            </Button>

            <div className="flex items-center justify-center my-4">
              <div className="border-t border-gray-300 flex-1"></div>
              <span className="px-4 text-gray-500 text-sm">ou</span>
              <div className="border-t border-gray-300 flex-1"></div>
            </div>

            <Button
              onClick={() => navigate('/auth/register/person')}
              className="w-full"
              variant="secondary"
            >
              <User size={20} />
              Pessoa Física
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Já possui uma conta?{' '}
              <button
                onClick={() => navigate('/auth/login')}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Entre aqui!
              </button>
            </p>
          </div>
        </div>
      </div>
      <div className="mb-6 w-full">
        <Button
          onClick={() => navigate('/auth/login')}
          className="w-full bg-[#3b444c] hover:bg-gray-800 text-white font-medium"
        >
          Não sabe qual escolher?
        </Button>
      </div>
    </div>
  );
};

export default RegisterTypeScreen;
