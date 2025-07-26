import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProject,
  getProjectBudgetItems,
  getProjectById,
  getProjectCronograma,
  getProjects,
  updateBudgetItems,
  updateCronograma,
  updateProject,
} from './projects.service';
import { toast } from 'sonner';
import { CreateProject, Project, CronogramaAtividade } from './types';
import { useNavigate } from 'react-router-dom';
import { BudgetItem } from '@/pages/project-budget';

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
      toast.error(error?.response?.data?.error || 'Erro ao criar o projeto.');
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

  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { projectId: string; projectData: CreateProject }) =>
      updateProject(data.projectId, data.projectData),
    onSuccess: (data: Project) => {
      queryClient.invalidateQueries({ queryKey: ['project-by-id', data.id] });
      toast.success('Projeto atualizado com sucesso!');

      navigate(`/project/${data.id}`);

      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || 'Erro ao atualizar o projeto.',
      );
    },
  });
}

export function useGetBudgetItemsQuery(projectId: string) {
  return useQuery({
    queryKey: ['budget-items', projectId],
    queryFn: async () => getProjectBudgetItems(projectId),
    enabled: !!projectId,
  });
}

export function useUpdateBudgetItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { projectId: string; data: BudgetItem[] }) =>
      updateBudgetItems(data.projectId, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-items'] });
      queryClient.invalidateQueries({ queryKey: ['project-by-id'] });
      toast.success('Item do orçamento atualizado com sucesso!');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Erro ao atualizar o item.');
    },
  });
}

export function useGetProjectCronogramaQuery(projectId: string) {
  return useQuery({
    queryKey: ['project-cronograma', projectId],
    queryFn: async () => getProjectCronograma(projectId),
    enabled: !!projectId,
  });
}

export function useUpdateCronogramaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: {
      projectId: string;
      cronograma: CronogramaAtividade[];
      evidencias: File[];
    }) => updateCronograma(data.projectId, data.cronograma, data.evidencias),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-by-id'] });
      toast.success('Cronograma atualizado com sucesso!');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || 'Erro ao atualizar o cronograma.',
      );
    },
  });
}
