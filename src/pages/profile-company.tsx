'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { ArrowLeft, Edit2, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { useAuth } from '@/contexts/auth';
import { useUpdateProfile } from '@/api/users/users.queries';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { getUserByCpf } from '@/api/users/users.service';

export default function CompanyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cpfInput, setCpfInput] = useState('');
  const [searchResult, setSearchResult] = useState<{
    nome: string;
    cpf: string;
  } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<
    { nome: string; cpf: string }[]
  >([]);

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    empresa: user?.nome || '',
    cnpj: user?.cnpj || '',
    telefone: user?.telefone || '',
    mei: user?.isMei || false,
    inscricaoEstadual: user?.inscricaoEstadual || '',
    inscricaoMunicipal: user?.inscricaoMunicipal || '',
    imagem: null as File | null,
    email: user?.email || '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const { mutateAsync, isPending } = useUpdateProfile();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imagem: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearchUser = async () => {
    if (!cpfInput) return;
    setSearchLoading(true);
    try {
      const u = await getUserByCpf(cpfInput.replace(/\D/g, ''));
      setSearchResult({
        nome: (u.nome_completo || u.nome) as string,
        cpf: u.cpf,
      });
    } catch {
      toast.error('Usuário não encontrado.');
      setSearchResult(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddUser = () => {
    if (!searchResult) return;
    if (selectedUsers.some((u) => u.cpf === searchResult.cpf)) {
      toast.error('Usuário já adicionado.');
      return;
    }
    const updated = [...selectedUsers, searchResult];
    setSelectedUsers(updated);
  };

  const handleRemoveUser = (cpf: string) => {
    const updated = selectedUsers.filter((u) => u.cpf !== cpf);
    setSelectedUsers(updated);
  };

  const handleSave = async () => {
    const { telefone, senhaAtual, novaSenha, confirmarSenha, imagem } =
      formData;
    if (novaSenha && novaSenha !== confirmarSenha) {
      toast.error(
        'As senhas não coincidem. Por favor, verifique e tente novamente.',
      );
      return;
    }
    const data = new FormData();
    data.append('telefone', telefone || '');
    data.append('senhaAtual', senhaAtual || '');
    data.append('novaSenha', novaSenha || '');
    if (selectedUsers.length) {
      data.append(
        'usuariosCpfs',
        JSON.stringify(selectedUsers.map((u) => u.cpf)),
      );
    }
    if (imagem) data.append('imagem', imagem);
    const res = await mutateAsync(data);
    if (res) {
      setFormData((prev) => ({
        ...prev,
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: '',
      }));
      setSelectedUsers([]);
      setCpfInput('');
      setIsEditing(false);
    }
  };

  const handleBack = () => setIsEditing(false);

  useEffect(() => {
    if (user) {
      setFormData({
        empresa: user.nome || '',
        cnpj: user.cnpj || '',
        telefone: user.telefone || '',
        mei: user.isMei || false,
        inscricaoEstadual: user.inscricaoEstadual || '',
        inscricaoMunicipal: user.inscricaoMunicipal || '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        imagem: user.imagemUrl as string | null as any,
        email: user.email || '',
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: '',
      });
      setPreviewUrl(user.imagemUrl || null);
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
          <div className="flex flex-col items-center py-6 gap-2">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-700">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span>{user?.nome?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <label htmlFor="image-upload">
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer">
                  <Edit2 className="w-3 h-3 text-white" />
                </div>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          <div className="px-4 space-y-4">
            <div>
              <Label htmlFor="empresa" className="text-sm text-gray-600">
                Razão Social
              </Label>
              <Input
                id="empresa"
                value={formData.empresa}
                disabled
                className="mt-1"
                placeholder="Lorem Ipsum"
              />
            </div>
            <div>
              <Label htmlFor="cnpj" className="text-sm text-gray-600">
                CNPJ
              </Label>
              <Input
                readOnly
                disabled
                id="cnpj"
                value={formData.cnpj}
                className="mt-1"
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm text-gray-600">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                readOnly
                disabled
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
            <div>
              <Label className="text-sm text-gray-600">
                Associar usuários por CPF
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o CPF"
                  value={cpfInput}
                  onChange={(e) => setCpfInput(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleSearchUser}
                  disabled={searchLoading}
                >
                  {searchLoading ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
              {searchResult && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">{searchResult.nome}</span>
                  <Button type="button" size="sm" onClick={handleAddUser}>
                    Adicionar
                  </Button>
                </div>
              )}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUsers.map((u) => (
                    <Badge key={u.cpf} className="flex items-center gap-1">
                      {u.nome} ({u.cpf})
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleRemoveUser(u.cpf)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 p-4 mt-8">
            <Button
              variant="outline"
              disabled={isPending}
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700"
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Button
              disabled={isPending}
              className="flex-1 bg-teal-600 hover:bg-teal-700"
              onClick={handleSave}
            >
              {isPending && (
                <div className="size-4 border-4 border-secondary border-t-transparent rounded-full animate-spin mr-2" />
              )}
              Salvar
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      <div className="w-full flex items-center justify-center p-4 border-b">
        <h1 className="text-lg font-medium">Perfil</h1>
        <div className="w-5" />
      </div>
      <div className="max-w-2xl w-full mx-auto bg-white flex-1">
        <div className="flex justify-center py-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-700">
            <img
              src={user.imagemUrl || '/images/default-avatar.png'}
              alt="Profile"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="px-4">
          <h2 className="text-sm text-gray-600 mb-4">Informações cadastrais</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Empresa</p>
              <p className="text-sm font-medium">{formData.empresa}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">CNPJ</p>
              <p className="text-sm font-medium">{formData.cnpj}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Telefone</p>
              <p className="text-sm font-medium">{formData.telefone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">MEI</p>
              <p className="text-sm font-medium">
                {formData.mei ? 'Sim' : 'Não'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Inscrição Estadual</p>
              <p className="text-sm font-medium">
                {formData.inscricaoEstadual}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Inscrição Municipal</p>
              <p className="text-sm font-medium">
                {formData.inscricaoMunicipal}
              </p>
            </div>
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
