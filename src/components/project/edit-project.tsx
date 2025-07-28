'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Save, DollarSign, Activity, Loader2 } from 'lucide-react';
import {
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useChangeProjectVisibilityMutation,
} from '@/api/projects/projects.queries';
import { Project } from '@/api/projects/types';
import { CurrencyInput } from '../ui/currency-input';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Globe } from 'lucide-react';

interface ProjectActivity {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  start: string;
  end: string;
}

const statusOptions = [
  { value: 'novo', label: 'Novo', color: 'bg-blue-100 text-blue-800' },
  {
    value: 'andamento',
    label: 'Em Andamento',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 'pendente',
    label: 'Pendente',
    color: 'bg-orange-100 text-orange-800',
  },
  { value: 'atrasado', label: 'Atrasado', color: 'bg-red-100 text-red-800' },
  {
    value: 'concluido',
    label: 'Concluído',
    color: 'bg-green-100 text-green-800',
  },
];

export default function EditProjectTab({
  project,
  setInitialTab,
}: {
  project: Project;
  setInitialTab: (tab: string) => void;
}) {
  const [projectStatus, setProjectStatus] = useState(project.status || 'novo');
  const navigate = useNavigate();
  const [budgetSpent, setBudgetSpent] = useState(
    project.orcamento_gasto?.toString() || '0',
  );
  const [budgetPlanned, setBudgetPlanned] = useState(
    project.orcamento_previsto?.toString() || '0',
  );
  const [isPublic, setIsPublic] = useState(project.is_public);

  const { mutateAsync: deleteProject, isPending: isDeleting } =
    useDeleteProjectMutation();

  const { mutateAsync, isPending } = useUpdateProjectMutation();

  const { mutateAsync: changeVisibility, isPending: isChangingVisibility } =
    useChangeProjectVisibilityMutation();

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status,
    );
    return statusOption ? statusOption : statusOptions[0];
  };

  const handleSave = async () => {
    const data = {
      orcamento_gasto: Number(budgetSpent),
      orcamento_previsto: Number(budgetPlanned),
      status: projectStatus,
      is_public: isPublic,
    };

    const res = await mutateAsync({
      projectId: project.id,
      projectData: data,
    });

    if (res) {
      setInitialTab('details');
    }
  };

  const handleVisibilityChange = async () => {
    const res = await changeVisibility({
      projectId: project.id,
      isPublic: !isPublic,
    });

    if (res) {
      setIsPublic(!isPublic);
    }
  };

  const handleDelete = async () => {
    await deleteProject(project.id);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Editar Projeto</h1>
          <p className="text-muted-foreground">
            Gerencie as informações do seu projeto
          </p>
        </div>
        <Button
          disabled={isPending}
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Status do Projeto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Status do Projeto
            </CardTitle>
            <CardDescription>
              Atualize o status atual do projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="status">Status Atual</Label>
                <Select value={projectStatus} onValueChange={setProjectStatus}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-center">
                <Label className="text-sm text-muted-foreground mb-2">
                  Preview
                </Label>
                <Badge className={getStatusBadge(projectStatus).color}>
                  {getStatusBadge(projectStatus).label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orçamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Orçamento
            </CardTitle>
            <CardDescription>Visualize um resumo do orçamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget-planned">Orçamento (R$)</Label>
                <CurrencyInput
                  id="budget-planned"
                  value={budgetPlanned}
                  disabled
                  className="mt-2 opacity-70 cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="budget-spent">Gasto (R$)</Label>
                <CurrencyInput
                  id="budget-spent"
                  value={budgetSpent}
                  disabled
                  className="mt-2 opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            <Button
              onClick={() => navigate(`/project/${project.id}/budget`)}
              className="mt-4"
            >
              Gerenciar Orçamento
            </Button>
          </CardContent>
        </Card>

        {/* Visibilidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Visibilidade
            </CardTitle>
            <CardDescription>
              Defina se o projeto é público ou privado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>{isPublic ? 'Público' : 'Privado'}</span>
              <Switch
                checked={isPublic}
                onCheckedChange={handleVisibilityChange}
                disabled={isChangingVisibility}
              />
            </div>
          </CardContent>
        </Card>

        {/* Atividades */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades do Projeto</CardTitle>
            <CardDescription>
              Gerencie as atividades em uma tela dedicada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate(`/project/${project.id}/activities`)}
              className="mt-2"
            >
              Gerenciar Atividades
            </Button>
          </CardContent>
        </Card>

        {/* Excluir Projeto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Excluir Projeto
            </CardTitle>
            <CardDescription>Essa ação não poderá ser desfeita</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Excluir Projeto'
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação removerá permanentemente o projeto.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
