'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NewProjectButton() {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/project/new')}
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 rounded-3xl"
      variant="secondary"
    >
      <Plus className="mr-2" />
      Novo Projeto
    </Button>
  );
}
