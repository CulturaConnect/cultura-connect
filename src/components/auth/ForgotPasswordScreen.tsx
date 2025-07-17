'use client';

import { useState } from 'react';
import { z } from 'zod';
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
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import Logo from './Logo';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import {
  useCheckResetCodeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '@/api/auth/auth.queries';
import { toast } from 'sonner';

const emailSchema = z.object({
  email: z.string().email('Email inválido'),
});

const codeSchema = z.object({
  code: z.string().min(6, 'O código deve ter 6 dígitos'),
});

const passwordSchema = z
  .object({
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });

type EmailData = z.infer<typeof emailSchema>;
type CodeData = z.infer<typeof codeSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const { forgotPasswordSend } = useAuth();

  const navigate = useNavigate();

  const { mutateAsync } = useCheckResetCodeMutation();

  const { mutateAsync: resetPasswordMutation } = useResetPasswordMutation();

  const { mutateAsync: forgotPasswordSendMutation } =
    useForgotPasswordMutation();

  const emailForm = useForm<EmailData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const codeForm = useForm<CodeData>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: '',
    },
  });

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const sendEmail = async (data: EmailData) => {
    try {
      setLoading(true);

      const res = await forgotPasswordSendMutation(data.email);
      if (res) {
        setStep(2);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        'Erro ao enviar o e-mail. Verifique se o e-mail está correto e tente novamente.',
      );
      emailForm.reset();
    }
  };

  const validateCode = async (data: CodeData) => {
    setLoading(true);
    const res = await mutateAsync({
      code: data.code,
      email: emailForm.getValues('email'),
    });
    if (res) {
      setStep(3);
    }
    setLoading(false);
  };

  const resetPassword = async (data: PasswordData) => {
    setLoading(true);
    const res = await resetPasswordMutation({
      password: data.password,
      code: codeForm.getValues('code'),
      email: emailForm.getValues('email'),
    });
    if (res) {
      setSuccess(true);
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (success) {
      return (
        <div className="text-center p-8">
          <CheckCircle className="text-primary mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Senha redefinida com sucesso!
          </h2>
          <p className="text-gray-600 mb-6">
            Agora você pode entrar com sua nova senha
          </p>
          <Button onClick={() => navigate('/auth/login')} className="w-full">
            Entrar
          </Button>
        </div>
      );
    }

    if (step === 1) {
      return (
        <Form {...emailForm} key={step}>
          <form
            onSubmit={emailForm.handleSubmit(sendEmail)}
            className="space-y-6"
          >
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar código'}
            </Button>
          </form>
        </Form>
      );
    }

    if (step === 2) {
      return (
        <Form {...codeForm} key={step}>
          <form
            onSubmit={codeForm.handleSubmit(validateCode)}
            className="space-y-6"
          >
            <FormField
              control={codeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      <InputOTPGroup className="flex w-full">
                        <InputOTPSlot className="flex-1" index={0} />
                        <InputOTPSlot className="flex-1" index={1} />
                        <InputOTPSlot className="flex-1" index={2} />
                        <InputOTPSlot className="flex-1" index={3} />
                        <InputOTPSlot className="flex-1" index={4} />
                        <InputOTPSlot className="flex-1" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Validando...' : 'Validar código'}
            </Button>
          </form>
        </Form>
      );
    }

    if (step === 3) {
      return (
        <Form {...passwordForm} key={step}>
          <form
            onSubmit={passwordForm.handleSubmit(resetPassword)}
            className="space-y-6"
          >
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPass ? 'text' : 'password'}
                        placeholder="Digite sua nova senha"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar nova senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirme a senha"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Redefinindo...' : 'Redefinir senha'}
            </Button>
          </form>
        </Form>
      );
    }
  };

  return (
    <div className="max-w-2xl container px-6 mx-auto">
      <div className="flex items-center mb-6 justify-center">
        <Logo />
      </div>

      <div className="text-xl font-semibold text-gray-800 border-b pb-2 w-full text-center">
        <h3>Redefinição de Senha</h3>
      </div>

      <div className="text-gray-600 mt-2 mb-6 text-sm">
        {step === 1 ? (
          <p>
            Insira o e-mail associado à sua conta e nós enviaremos um código
            para redefinir sua senha.
          </p>
        ) : step === 2 ? (
          <p>Insira o código enviado para seu e-mail </p>
        ) : step === 3 ? null : null}
      </div>

      {renderStep()}
    </div>
  );
}
