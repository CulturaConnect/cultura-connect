import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProject, getProjectById, getProjects } from './projects.service';
import { toast } from 'sonner';

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto criado com sucesso!');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erro ao criar o projeto.');
    },
  });
}

export function useGetProjectsQuery(searchQuery?: string) {
  return useQuery({
    queryKey: ['projects', searchQuery],
    queryFn: async () => getProjects(),
    select: (data) => {
      if (!searchQuery) return data;

      return data.filter(
        (project) =>
          project.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.responsavel_principal.nome
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.responsavel_legal.nome
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.segmento.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.titulo_oficial
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    },
  });
}

export function useGetProjectByIdQuery(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => getProjectById(projectId),
    enabled: !!projectId,
  });
}
