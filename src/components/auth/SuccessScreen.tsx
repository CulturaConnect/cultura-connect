import { Button } from '@/components/ui/button';
import { CheckCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-slide-up">
      <div className="glass-card rounded-3xl p-6 shadow-2xl text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-white" size={32} />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo!</h2>
        <p className="text-gray-600 mb-6">Login realizado com sucesso</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <User className="text-gray-400 mr-2" size={20} />
            <span className="text-gray-600 font-medium">Logado como:</span>
          </div>
          <p className="text-primary font-semibold">teste</p>
        </div>

        <Button
          onClick={() => navigate('/')}
          className="w-full h-12 rounded-xl gradient-bg hover:opacity-90 text-white font-medium text-lg"
        >
          Continuar
        </Button>

        <button
          onClick={() => navigate('/auth/login')}
          className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium"
        >
          Fazer logout
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
