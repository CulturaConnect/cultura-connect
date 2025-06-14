import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProject, getProjects } from './projects.service';
import { useSearchParams } from 'react-router-dom';

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useGetProjectsQuery(searchQuery?: string) {
  console.log('useGetProjectsQuery called with searchQuery:', searchQuery);
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
