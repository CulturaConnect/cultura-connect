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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Trash2,
  Plus,
  Save,
  DollarSign,
  Activity,
  Loader2,
} from 'lucide-react';
import { useUpdateProjectMutation } from '@/api/projects/projects.queries';
import { CreateProject, Project } from '@/api/projects/types';
import { CurrencyInput } from '../ui/currency-input';

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
    project.orcamento_gasto.toString() || '0',
  );
  const [budgetPlanned, setBudgetPlanned] = useState(
    project.orcamento_previsto.toString() || '0',
  );

  const { mutateAsync, isPending } = useUpdateProjectMutation();

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
    };

    const res = await mutateAsync({
      projectId: project.id,
      projectData: data,
    });

    if (res) {
      setInitialTab('details');
    }
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
            <CardDescription>
              Gerencie o orçamento previsto e gasto do projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget-planned">Orçamento Previsto (R$)</Label>
                <CurrencyInput
                  id="budget-planned"
                  value={budgetPlanned}
                  onValueChange={(value) => setBudgetPlanned(value || '')}
                  className="mt-2"
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <Label htmlFor="budget-spent">Orçamento Gasto (R$)</Label>
                <CurrencyInput
                  id="budget-spent"
                  value={budgetSpent}
                  onValueChange={(value) => setBudgetSpent(value || '')}
                  className="mt-2"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span>Orçamento Restante:</span>
                <span
                  className={`font-semibold ${
                    Number.parseFloat(budgetPlanned) -
                      Number.parseFloat(budgetSpent) >=
                    0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  R${' '}
                  {(() => {
                    const planned = parseFloat(budgetPlanned);
                    const spent = parseFloat(budgetSpent);

                    const difference =
                      isNaN(planned) || isNaN(spent) ? 0 : planned - spent;

                    return difference.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                  })()}
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (Number.parseFloat(budgetSpent) /
                        Number.parseFloat(budgetPlanned)) *
                        100,
                      100,
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>R$ 0</span>
                <span>
                  {(() => {
                    const value = parseFloat(budgetPlanned);
                    return isNaN(value)
                      ? 'R$ --'
                      : `R$ ${value.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`;
                  })()}{' '}
                </span>
              </div>
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
      </div>
    </div>
  );
}
