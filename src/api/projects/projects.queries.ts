import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProject,
  getProjectById,
  getProjects,
  updateProject,
} from './projects.service';
import { toast } from 'sonner';
import { CreateProject, Project } from './types';

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto criado com sucesso!');
      return true;
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
    queryKey: ['project-by-id', projectId],
    queryFn: async () => getProjectById(projectId),
    enabled: !!projectId,
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { projectId: string; projectData: CreateProject }) =>
      updateProject(data.projectId, data.projectData),
    onSuccess: (data: Project) => {
      queryClient.invalidateQueries({ queryKey: ['project-by-id', data.id] });
      toast.success('Projeto atualizado com sucesso!');
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Erro ao atualizar o projeto.',
      );
    },
  });
}
