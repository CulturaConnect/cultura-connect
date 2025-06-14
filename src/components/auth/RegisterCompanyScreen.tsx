'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';

const step1Schema = z
  .object({
    cnpj: z.string().min(14, 'CNPJ inválido'),
    isMei: z.boolean().optional(),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha muito curta'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

const step2Schema = z.object({
  razaoSocial: z.string().min(1, 'Campo obrigatório'),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  telefone: z.string().min(8, 'Telefone inválido'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

export default function RegisterCompanyScreen() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const formStep1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      cnpj: '',
      isMei: false,
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const formStep2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      razaoSocial: '',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      telefone: '',
    },
  });

  const handleSubmitStep1 = async (data: Step1Data) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setStep(2);
    setLoading(false);
  };

  const handleSubmitStep2 = async (data: Step2Data) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setLoading(false);
  };

  return (
    <div className="animate-slide-up flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="w-full flex flex-col items-center">
        <div className="mb-6">
          <Logo />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 w-full text-center">
          Cadastro empresa
        </h2>

        {step === 1 && (
          <Form {...formStep1}>
            <form
              onSubmit={formStep1.handleSubmit(handleSubmitStep1)}
              className="space-y-4 w-full"
            >
              <FormField
                control={formStep1.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o CNPJ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formStep1.control}
                name="isMei"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Sou MEI
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={formStep1.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o e-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formStep1.control}
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
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
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
                control={formStep1.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? 'text' : 'password'}
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowConfirm(!showConfirm)}
                        >
                          {showConfirm ? (
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
                  onClick={() => navigate('/auth/register-type')}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Voltar
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  Avançar
                </Button>
              </div>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...formStep2}>
            <form
              onSubmit={formStep2.handleSubmit(handleSubmitStep2)}
              className="space-y-4 w-full"
            >
              <FormField
                control={formStep2.control}
                name="razaoSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a razão social" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formStep2.control}
                name="inscricaoEstadual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inscrição Estadual</FormLabel>
                    <FormControl>
                      <Input placeholder="Inscrição Estadual" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formStep2.control}
                name="inscricaoMunicipal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inscrição Municipal</FormLabel>
                    <FormControl>
                      <Input placeholder="Inscrição Municipal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formStep2.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o telefone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Voltar
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  Cadastrar
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
