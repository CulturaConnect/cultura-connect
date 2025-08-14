'use client';

import { useGetProjectsQuery } from '@/api/projects/projects.queries';
import { ProjectCard } from './project-card';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Project } from '@/api/projects/types';

interface ProjectsGridProps {
  filterBy?: 'all' | 'mine';
}
export function ProjectsGrid({ filterBy = 'all' }: ProjectsGridProps) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { user } = useAuth();
  const { data } = useGetProjectsQuery(searchQuery);

  function getProjectProgress(project: Project) {
    const totalActivities = project.cronograma_atividades?.length || 0;
    const completedActivities =
      project.cronograma_atividades?.filter(
        (activity) => activity.status === 'concluido',
      ).length || 0;

    const progress =
      totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
    return Math.round(progress);
  }

  const projects =
    filterBy === 'mine' && user
      ? data?.filter((p) => p.company_id === user.id)
      : data;

  return (
    <div className="p-6 overflow-y-auto flex-1">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.nome}
            progress={getProjectProgress(project)}
            imageUrl={project?.imagem_url || ''}
          />
        ))}
      </div>
    </div>
  );
}
