'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Edit2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { useAuth } from '@/contexts/auth';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user } = useAuth();

  console.log('User data:', user);

  const [formData, setFormData] = useState({
    empresa: user?.nome || '',
    nome: user?.nome || '',
    cpf: user?.tipo === 'person' ? user.cpf : null,
    cnpj: user?.tipo === 'company' ? user.cnpj : null,
    telefone: user?.telefone || '',
    mei: user?.tipo === 'company' ? user.isMei : null,
    inscricaoEstadual: user?.inscricaoEstadual || null,
    inscricaoMunicipal: user?.inscricaoMunicipal || null,
    email: user?.email || '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleBack = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        empresa: user.nome || '',
        nome: user.nome || '',
        cpf: user.tipo === 'person' ? user.cpf : '',
        cnpj: user.tipo === 'company' ? user.cnpj : '',
        telefone: user.telefone || '',
        mei: user.tipo === 'company' ? user.isMei : null,
        inscricaoEstadual: user.inscricaoEstadual || null,
        inscricaoMunicipal: user.inscricaoMunicipal || null,
        email: user.email || '',
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: '',
      });
    }
  }, [user]);

  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando perfil...</h1>
          <p className="text-gray-500">
            Por favor, aguarde enquanto carregamos seus dados.
          </p>
        </div>
      </main>
    );
  }

  if (isEditing) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="flex items-center justify-between p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-0 h-auto"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium">Perfil</h1>
          <div className="w-5" />
        </div>

        <div className="max-w-2xl w-full mx-auto bg-white">
          <div className="flex justify-center py-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700">
                CON
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                <Edit2 className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <div className="px-4 space-y-4">
            {user?.tipo === 'person' ? (
              <div>
                <Label htmlFor="nome" className="text-sm text-gray-600">
                  Nome
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="mt-1"
                  placeholder="Seu nome completo"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="empresa" className="text-sm text-gray-600">
                  Empresa
                </Label>
                <Input
                  id="empresa"
                  value={formData.empresa}
                  onChange={(e) => handleInputChange('empresa', e.target.value)}
                  className="mt-1"
                  placeholder="Lorem Ipsum"
                />
              </div>
            )}

            {user?.tipo === 'person' ? (
              <div>
                <Label htmlFor="cpf" className="text-sm text-gray-600">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  className="mt-1"
                  placeholder="000.000.000-00"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="cnpj" className="text-sm text-gray-600">
                  CNPJ
                </Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                  className="mt-1"
                  placeholder="00.000.000/0000-00"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm text-gray-600">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
                placeholder="lorem@ipsum.com.br"
              />
            </div>

            <div>
              <Label htmlFor="telefone" className="text-sm text-gray-600">
                Telefone
              </Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                className="mt-1"
                placeholder="(99) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="senhaAtual" className="text-sm text-gray-600">
                Senha atual
              </Label>
              <div className="relative mt-1">
                <Input
                  id="senhaAtual"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={formData.senhaAtual}
                  onChange={(e) =>
                    handleInputChange('senhaAtual', e.target.value)
                  }
                  placeholder="Digite sua senha atual"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Esqueci minha senha</p>
            </div>

            <div>
              <Label htmlFor="novaSenha" className="text-sm text-gray-600">
                Nova senha
              </Label>
              <div className="relative mt-1">
                <Input
                  id="novaSenha"
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.novaSenha}
                  onChange={(e) =>
                    handleInputChange('novaSenha', e.target.value)
                  }
                  placeholder="Digite sua nova senha"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmarSenha" className="text-sm text-gray-600">
                Confirmar nova senha
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmarSenha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmarSenha}
                  onChange={(e) =>
                    handleInputChange('confirmarSenha', e.target.value)
                  }
                  placeholder="Confirme sua nova senha"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-4 mt-8">
            <Button
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Button
              className="flex-1 bg-teal-600 hover:bg-teal-700"
              onClick={handleSave}
            >
              Salvar
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      <div className="w-full flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="sm" className="p-0 h-auto">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-medium">Perfil</h1>
        <div className="w-5" />
      </div>

      <div className="max-w-2xl w-full mx-auto bg-white flex-1">
        <div className="flex justify-center py-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700">
              CON
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
              <Edit2 className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        <div className="px-4">
          <h2 className="text-sm text-gray-600 mb-4">Informações cadastrais</h2>

          <div className="space-y-3">
            {user?.tipo === 'person' ? (
              <div>
                <p className="text-xs text-gray-500">Nome</p>
                <p className="text-sm font-medium">{formData.nome}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500">Empresa</p>
                <p className="text-sm font-medium">{formData.empresa}</p>
              </div>
            )}

            {user?.tipo === 'person' ? (
              <div>
                <p className="text-xs text-gray-500">CPF</p>
                <p className="text-sm font-medium">{formData.cpf}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500">CNPJ</p>
                <p className="text-sm font-medium">{formData.cnpj}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500">Telefone</p>
              <p className="text-sm font-medium">{formData.telefone}</p>
            </div>

            {user?.tipo === 'company' && (
              <div>
                <p className="text-xs text-gray-500">MEI</p>
                <p className="text-sm font-medium">
                  {formData.mei ? 'Sim' : 'Não'}
                </p>
              </div>
            )}

            {user?.tipo === 'company' && (
              <div>
                <p className="text-xs text-gray-500">Inscrição Estadual</p>
                <p className="text-sm font-medium">
                  {formData.inscricaoEstadual}
                </p>
              </div>
            )}

            {user?.tipo === 'company' && (
              <div>
                <p className="text-xs text-gray-500">Inscrição Municipal</p>
                <p className="text-sm font-medium">
                  {formData.inscricaoMunicipal}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500">E-mail</p>
              <p className="text-sm font-medium">{formData.email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Senha</p>
              <p className="text-sm font-medium">••••••</p>
            </div>
          </div>
        </div>

        <div className="px-4 mt-8">
          <Button
            className="w-full bg-teal-600 hover:bg-teal-700"
            onClick={() => setIsEditing(true)}
          >
            Editar informações
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Algumas informações só podem ser editadas com o auxílio do suporte
            técnico.
          </p>
        </div>

        <BottomNavigation />
      </div>
    </main>
  );
}
