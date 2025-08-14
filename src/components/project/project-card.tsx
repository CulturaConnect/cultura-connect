'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  id: string;
  title: string;
  progress?: number;
  imageUrl: string;
}

export function ProjectCard({
  title,
  progress,
  id,
  imageUrl,
}: ProjectCardProps) {
  const navigate = useNavigate();

  console.log(imageUrl, 'Image URL in ProjectCard');

  return (
    <Card
      onClick={() => navigate(`/project/${id}`)}
      className="relative overflow-hidden h-48 cursor-pointer group hover:scale-105 transition-transform"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative h-full flex flex-col justify-between px-4 pb-4 pt-2 text-white">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>

        <div className="space-y-2">
          {progress !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-75">Progresso</span>
                <span className="text-sm font-semibold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/20" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
