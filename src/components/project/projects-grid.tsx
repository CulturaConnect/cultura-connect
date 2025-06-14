'use client';

import { useGetProjectsQuery } from '@/api/projects/projects.queries';
import { ProjectCard } from './project-card';
import { useSearchParams } from 'react-router-dom';

const projectsData = [
  {
    id: '1',
    title: "SAMBA D'O",
    subtitle: 'GRUPO ATIVO',
    progress: 25,
    imageUrl:
      'https://alataj.com.br/wp-content/uploads/2021/06/ALATAJ-SITE-xxx.jpg',
  },
  {
    id: '2',
    title: 'RAP FEST',
    subtitle: 'GRUPO ATIVO',
    progress: 32,
    imageUrl:
      'https://alataj.com.br/wp-content/uploads/2021/06/ALATAJ-SITE-xxx.jpg',
  },
  {
    id: '3',
    title: 'ACTO COMUNIDADE',
    subtitle: 'GRUPO ATIVO',
    progress: 11,
    imageUrl:
      'https://alataj.com.br/wp-content/uploads/2021/06/ALATAJ-SITE-xxx.jpg',
  },
  {
    id: '4',
    title: 'MAGAE SING',
    subtitle: 'GRUPO ATIVO',
    progress: 44,
    imageUrl:
      'https://alataj.com.br/wp-content/uploads/2021/06/ALATAJ-SITE-xxx.jpg',
  },
  {
    id: '5',
    title: 'SABADO EM CENA',
    subtitle: 'GRUPO ATIVO',
    status: 'Incom...',
    imageUrl:
      'https://alataj.com.br/wp-content/uploads/2021/06/ALATAJ-SITE-xxx.jpg',
  },
  {
    id: '6',
    title: 'POEMANDO',
    subtitle: 'GRUPO ATIVO',
    imageUrl:
      'https://alataj.com.br/wp-content/uploads/2021/06/ALATAJ-SITE-xxx.jpg',
  },
];

export function ProjectsGrid() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  console.log('ProjectsGrid searchQuery:', searchQuery);

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
      <div className="grid grid-cols-2 gap-4">
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
