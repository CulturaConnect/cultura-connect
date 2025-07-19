import { useMutation } from '@tanstack/react-query';
import { forgotPassword, resetCodeCheck, resetPassword } from './auth.service';
import { toast } from 'sonner';

export function useCheckResetCodeMutation() {
  return useMutation({
    mutationFn: resetCodeCheck,
    onSuccess: () => {
      toast.success('Código verificado com sucesso!');

      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || 'Erro ao verificar o código.',
      );
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso!');

      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Erro ao redefinir a senha.');
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success('E-mail enviado com sucesso!');

      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Erro ao enviar o e-mail.');
    },
  });
}
