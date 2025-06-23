'use client';

import { useGetProjectsQuery } from '@/api/projects/projects.queries';
import { ProjectCard } from './project-card';
import { useSearchParams } from 'react-router-dom';

export function ProjectsGrid() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const { data } = useGetProjectsQuery(searchQuery);

  function getProjectProgress(project) {
    const inicio = new Date(project.inicio);
    const fim = new Date(project.fim);

    const totalDuration = fim.getTime() - inicio.getTime();
    const currentDuration = new Date().getTime() - inicio.getTime();
    const progress = Math.min(
      Math.max((currentDuration / totalDuration) * 100, 0),
      100,
    );
    return Math.round(progress);
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.nome}
            subtitle={project.titulo_oficial}
            progress={getProjectProgress(project)}
            imageUrl={project.imagem_url || ''}
          />
        ))}
      </div>
    </div>
  );
}
