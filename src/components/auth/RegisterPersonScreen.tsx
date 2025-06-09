'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { useState } from 'react';
import Logo from './Logo';
import { AuthScreen } from '@/pages/Index';

const schema = z
  .object({
    nomeCompleto: z.string().min(1, 'Nome é obrigatório'),
    cpf: z.string().min(11, 'CPF inválido'),
    email: z.string().email('E-mail inválido'),
    telefone: z.string().min(8, 'Telefone inválido'),
    password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

interface RegisterPersonScreenProps {
  onScreenChange: (screen: AuthScreen, email?: string) => void;
}

export default function RegisterPersonScreen({
  onScreenChange,
}: RegisterPersonScreenProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nomeCompleto: '',
      cpf: '',
      email: '',
      telefone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    onScreenChange('success', values.email);
  };

  return (
    <div className="animate-slide-up flex flex-col items-center w-full max-w-md mx-auto">
      <div className="p-6 w-full">
        <div className="flex items-center mb-6 w-full justify-center">
          <Logo />
        </div>

        <div className="text-center mb-6 border-b pb-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Cadastro pessoa
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nomeCompleto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu CPF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu telefone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        className="pr-10"
                        placeholder="Digite sua senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...field}
                        className="pr-10"
                        placeholder="Confirme sua senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={() => onScreenChange('register-type')}
                className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
