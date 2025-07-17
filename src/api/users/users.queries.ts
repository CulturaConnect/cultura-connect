import { useMutation } from '@tanstack/react-query';
import { updateProfile } from './users.service';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

export function useUpdateProfile() {
  const { updateUser } = useAuth();
  return useMutation({
    mutationKey: ['update-profile'],
    mutationFn: updateProfile,
    onSuccess: (data) => {
      if (!data?.user) {
        toast.error('Erro ao atualizar o perfil.');
        return;
      }

      updateUser(data?.user);

      toast.success('Perfil atualizado com sucesso!');

      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Erro ao atualizar o perfil.',
      );
    },
  });
}
