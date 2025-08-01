'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  useGetProjectByIdQuery,
  useGetProjectCronogramaQuery,
  useUpdateCronogramaMutation,
} from '@/api/projects/projects.queries';
import type { Project } from '@/api/projects/types';
import {
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  Save,
  Calendar,
  DollarSign,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Target,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export interface ProjectActivity {
  id: string;
  title: string;
  description: string;
  acompanhamento: string;
  status: string;
  start: string;
  end: string;
  evidences: Array<string | File | { url: string; descricao: string }>;
}

const statusOptions = [
  {
    value: 'novo',
    label: 'Novo',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    value: 'andamento',
    label: 'Em Andamento',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  {
    value: 'pendente',
    label: 'Pendente',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  {
    value: 'atrasado',
    label: 'Atrasado',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
  {
    value: 'concluido',
    label: 'Concluído',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'novo':
      return <Target className="w-4 h-4" />;
    case 'andamento':
      return <Clock className="w-4 h-4" />;
    case 'pendente':
      return <AlertCircle className="w-4 h-4" />;
    case 'atrasado':
      return <AlertCircle className="w-4 h-4" />;
    case 'concluido':
      return <CheckCircle2 className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

function EvidencePreview({ evidence }: { evidence: string | File | { url: string; descricao: string } }) {
  console.log(evidence)
  const url = useMemo(() => {
    if (typeof evidence === 'string') {
      return evidence;
    } else if (evidence instanceof File) {
      return URL.createObjectURL(evidence);
    } else {
      return evidence.url;
    }
  }, [evidence]);

  useEffect(() => {
    return () => {
      if (evidence instanceof File) {
        URL.revokeObjectURL(url);
      }
    };
  }, [evidence, url]);

  // Verifica por extensão se for string ou objeto com url
  const isImageFromUrl =
    (typeof evidence === 'string' && evidence.match(/\.(png|jpe?g|gif|bmp|webp|svg)$/i)) ||
    (typeof evidence === 'object' && 'url' in evidence && evidence.url.match(/\.(png|jpe?g|gif|bmp|webp|svg)$/i));

  // Verifica por MIME type se for File
  const isImageFromFile =
    evidence instanceof File && evidence.type.startsWith('image/');

  const isImage = isImageFromUrl || isImageFromFile;

  // Obter nome do arquivo
  const fileName = (() => {
    if (typeof evidence === 'string') {
      return evidence.split('/').pop() || 'Arquivo';
    } else if (evidence instanceof File) {
      return evidence.name || 'Arquivo';
    } else {
      return evidence.descricao || 'Arquivo';
    }
  })();

  return isImage ? (
    <img
      src={url}
      alt="Evidência"
      className="w-16 h-16 object-cover rounded border"
    />
  ) : (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-16 h-16 border rounded flex items-center justify-center text-xs text-blue-600 text-center p-1"
      title={fileName}
    >
      {fileName.length > 12 ? fileName.substring(0, 12) + '...' : fileName}
    </a>
  );
}

export default function ProjectActivities() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetProjectByIdQuery(projectId);
  const { data: cronogramaData, isLoading: isCronogramaLoading } =
    useGetProjectCronogramaQuery(projectId);

  const { mutateAsync, isPending } = useUpdateCronogramaMutation();

  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activityForm, setActivityForm] = useState<ProjectActivity>({
    id: '',
    title: '',
    description: '',
    acompanhamento: '',
    status: 'novo',
    start: '',
    end: '',
    evidences: [],
  });


  console.log(activityForm)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalActivities, setOriginalActivities] = useState<ProjectActivity[]>([]);
  console.log(activities);

  useEffect(() => {
    if (cronogramaData) {
      const mappedActivities = cronogramaData.map((a, idx) => ({
        id: idx.toString(),
        title: a.titulo || '',
        description: a.descricao || '',
        acompanhamento: a.acompanhamento || '',
        status: a.status || 'novo',
        start: a.inicio || '',
        end: a.fim || '',
        evidences: a.evidencias,
      }));
      setActivities(mappedActivities);
      setOriginalActivities(JSON.parse(JSON.stringify(mappedActivities)));
    }
  }, [cronogramaData]);

  // Detectar mudanças não salvas
  useEffect(() => {
    const hasChanges = JSON.stringify(activities) !== JSON.stringify(originalActivities);
    setHasUnsavedChanges(hasChanges);
  }, [activities, originalActivities]);

  // Função para lidar com tentativa de navegação
  const handleBackNavigation = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'Você tem alterações não salvas. Deseja realmente sair sem salvar?'
      );
      if (!confirmLeave) {
        return;
      }
    }
    navigate(-1);
  }, [hasUnsavedChanges, navigate]);

  // Função para cancelar alterações
  const handleCancelChanges = useCallback(() => {
    setActivities(JSON.parse(JSON.stringify(originalActivities)));
    setHasUnsavedChanges(false);
    toast.success('Alterações canceladas');
  }, [originalActivities]);

  if (isLoading || isCronogramaLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando atividades...</p>
        </div>
      </div>
    );
  }

  const totalActivities = activities.length;
  const inProgress = activities.filter((a) => a.status === 'andamento').length;
  const concluded = activities.filter((a) => a.status === 'concluido').length;

  const progressPercentage =
    totalActivities > 0 ? (concluded / totalActivities) * 100 : 0;

  const filteredActivities = activities.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openNewDialog = () => {
    setEditingIndex(null);
    setActivityForm({
      id: Date.now().toString(),
      title: '',
      description: '',
      acompanhamento: '',
      status: 'novo',
      start: '',
      end: '',
      evidences: [],
    });
    setDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    const act = activities[index];
    setEditingIndex(index);
    setActivityForm(act);
    setDialogOpen(true);
  };

  const parseLocalDate = (str: string) => {
    const [year, month, day] = str.split('-').map(Number);
    return new Date(year, month - 1, day); // ← aqui ele assume horário local
  };

  const handleDialogSave = () => {
    const { title, description, status, start, end } = activityForm;

    const missingFields = [];

    if (!title.trim()) missingFields.push('Título');
    if (!description.trim()) missingFields.push('Descrição');
    if (!status.trim()) missingFields.push('Status');
    if (!start) missingFields.push('Data de Início');
    if (!end) missingFields.push('Data de Término');

    // Se faltar qualquer campo
    if (missingFields.length > 0) {
      toast.error('Preencha todos os campos obrigatórios', {
        description: `Campos faltando: ${missingFields.join(', ')}`,
      });
      return;
    }

    const startDate = parseLocalDate(start);
    const endDate = parseLocalDate(end);
    const projectStart = new Date(data?.inicio);
    const projectEnd = new Date(data?.fim);

    const toDateOnly = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const isOutsideProjectRange =
      toDateOnly(startDate) < toDateOnly(projectStart) ||
      toDateOnly(endDate) > toDateOnly(projectEnd);

    if (isOutsideProjectRange) {
      toast.error('Datas fora do período do projeto', {
        description: `A atividade deve estar entre ${projectStart.toLocaleDateString(
          'pt-BR',
        )} e ${projectEnd.toLocaleDateString('pt-BR')}`,
      });
      return;
    }

    if (endDate < startDate) {
      toast.error('Data de término inválida', {
        description:
          'A data de término não pode ser anterior à data de início.',
      });
      return;
    }

    // Se passou por tudo, salva!
    if (editingIndex !== null) {
      const updated = [...activities];
      updated[editingIndex] = activityForm;
      setActivities(updated);
    } else {
      setActivities([...activities, activityForm]);
    }

    setDialogOpen(false);
  };

  const removeActivity = (index: number) => {
    const updated = [...activities];
    updated.splice(index, 1);
    setActivities(updated);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      const cronograma_atividades = activities.map((a) => ({
        titulo: a.title,
        descricao: a.description,
        acompanhamento: a.acompanhamento,
        status: a.status,
        inicio: a.start,
        fim: a.end,
        evidencias: a.evidences.filter((ev) => typeof ev === 'string' || (typeof ev === 'object' && 'url' in ev)), // preserva evidências antigas (strings e objetos com url)
      }));

      formData.append(
        'cronograma_atividades',
        JSON.stringify(cronograma_atividades),
      );

      activities.forEach((activity, index) => {
        activity.evidences.forEach((ev, evidenceIndex) => {
          if (ev instanceof File) {
            formData.append(`evidencias[${index}]`, ev);
            // Enviar o nome do arquivo como descrição
            formData.append(`evidencias_descricao_${index}_${evidenceIndex}`, ev.name);
          }
        });
      });

      await mutateAsync({
        projectId: data?.id || '',
        data: formData,
      });

      // Atualizar o estado original após salvar com sucesso
      setOriginalActivities(JSON.parse(JSON.stringify(activities)));
      setHasUnsavedChanges(false);
      toast.success('Alterações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar alterações');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="p-4 sm:p-6">
          {/* Mobile Layout */}
          <div className="flex flex-col space-y-4 sm:hidden">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackNavigation}
                className="hover:bg-slate-100 -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm">Voltar</span>
              </Button>
              <div className="flex gap-2">
                {hasUnsavedChanges && (
                  <Button
                    onClick={handleCancelChanges}
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={isPending || !hasUnsavedChanges}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-3 disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className="ml-2 hidden xs:inline">Salvar</span>
                </Button>
              </div>
            </div>
            <div className="text-center px-2">
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                Gerenciar Atividades
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Organize e acompanhe o progresso
              </p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackNavigation}
                className="hover:bg-slate-100 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Gerenciar Atividades
                </h1>
                <p className="text-slate-600 text-sm">
                  Organize e acompanhe o progresso do projeto
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {hasUnsavedChanges && (
                <Button
                  onClick={handleCancelChanges}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Cancelar Alterações
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={isPending || !hasUnsavedChanges}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total de Atividades
                  </p>
                  <p className="text-3xl font-bold mt-1">{totalActivities}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">
                    Em Andamento
                  </p>
                  <p className="text-3xl font-bold mt-1">{inProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Concluídas
                  </p>
                  <p className="text-3xl font-bold mt-1">{concluded}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Progresso
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {Math.round(progressPercentage)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Target className="w-5 h-5 text-blue-600" />
                Progresso do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">
                    {concluded}
                  </p>
                  <p className="text-sm text-slate-600">Concluídas</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">
                    {totalActivities - concluded}
                  </p>
                  <p className="text-sm text-slate-600">Restantes</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Progresso Geral</span>
                  <span className="font-medium">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="w-full">
                <Label htmlFor="search" className="text-slate-700 font-medium">
                  Buscar Atividades
                </Label>
                <Input
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Digite o nome da atividade..."
                  className="mt-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="w-full lg:w-48">
                <Label htmlFor="filter" className="text-slate-700 font-medium">
                  Filtrar por Status
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger
                    id="filter"
                    className="mt-2 border-slate-200 focus:border-blue-500"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={openNewDialog}
                    className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Atividade
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">
                      {editingIndex !== null
                        ? 'Editar Atividade'
                        : 'Nova Atividade'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <Label
                        htmlFor="title"
                        className="text-slate-700 font-medium"
                      >
                        Título da Atividade
                      </Label>
                      <Input
                        id="title"
                        value={activityForm.title}
                        onChange={(e) =>
                          setActivityForm({
                            ...activityForm,
                            title: e.target.value,
                          })
                        }
                        className="mt-2 border-slate-200 focus:border-blue-500"
                        placeholder="Digite o título da atividade"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="description"
                        className="text-slate-700 font-medium"
                      >
                        Descrição
                      </Label>
                      <Textarea
                        id="description"
                        rows={3}
                        value={activityForm.description}
                        onChange={(e) =>
                          setActivityForm({
                            ...activityForm,
                            description: e.target.value,
                          })
                        }
                        className="mt-2 border-slate-200 focus:border-blue-500"
                        placeholder="Descreva os detalhes da atividade"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="acompanhamento"
                        className="text-slate-700 font-medium"
                      >
                        Acompanhamento
                      </Label>
                      <Textarea
                        id="acompanhamento"
                        rows={3}
                        value={activityForm.acompanhamento}
                        onChange={(e) =>
                          setActivityForm({
                            ...activityForm,
                            acompanhamento: e.target.value,
                          })
                        }
                        className="mt-2 border-slate-200 focus:border-blue-500"
                        placeholder="Anotações sobre o andamento"
                      />
                    </div>
                    <div>
                      <div>
                        <Label
                          htmlFor="status"
                          className="text-slate-700 font-medium"
                        >
                          Status
                        </Label>
                        <Select
                          value={activityForm.status}
                          onValueChange={(v) =>
                            setActivityForm({ ...activityForm, status: v })
                          }
                        >
                          <SelectTrigger
                            id="status"
                            className="mt-2 border-slate-200"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="start"
                          className="text-slate-700 font-medium"
                        >
                          Data de Início
                        </Label>
                        <Input
                          id="start"
                          type="date"
                          value={activityForm.start}
                          onChange={(e) =>
                            setActivityForm({
                              ...activityForm,
                              start: e.target.value,
                            })
                          }
                          className="mt-2 border-slate-200 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="end"
                          className="text-slate-700 font-medium"
                        >
                          Data de Término
                        </Label>
                        <Input
                          id="end"
                          type="date"
                          value={activityForm.end}
                          onChange={(e) =>
                            setActivityForm({
                              ...activityForm,
                              end: e.target.value,
                            })
                          }
                          className="mt-2 border-slate-200 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="evidences"
                        className="text-slate-700 font-medium"
                      >
                        Evidências
                      </Label>
                      <Input
                        id="evidences"
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files
                            ? Array.from(e.target.files)
                            : [];
                          setActivityForm({
                            ...activityForm,
                            evidences: [...activityForm.evidences, ...files],
                          });
                          e.target.value = '';
                        }}
                        className="mt-2 border-slate-200"
                      />
                      {activityForm?.evidences?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {activityForm.evidences.map((ev, idx) => (
                            <EvidencePreview key={idx} evidence={ev} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="pt-6">
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="border-slate-200 bg-transparent"
                      >
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={handleDialogSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Salvar Atividade
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => {
            const statusOption = statusOptions.find(
              (opt) => opt.value === activity.status,
            );
            const statusIcon = getStatusIcon(activity.status);

            return (
              <Card
                key={activity.id}
                className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-[1.01]"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {activity.title}
                          </h3>
                          <p className="text-slate-600 leading-relaxed">
                            {activity.description}
                          </p>
                          {activity.acompanhamento && (
                            <p className="text-slate-500 text-sm mt-2 whitespace-pre-wrap">
                              {activity.acompanhamento}
                            </p>
                          )}
                        </div>
                        <Badge
                          className={`${statusOption?.color} border flex items-center gap-1 px-3 py-1`}
                        >
                          {statusIcon}
                          {statusOption?.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Início:</span>
                          <span className="font-semibold text-slate-900">
                            {activity.start
                              ? parseLocalDate(
                                  activity.start,
                                ).toLocaleDateString('pt-BR')
                              : 'Não definido'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 text-red-600" />
                          <span className="text-sm">Término:</span>
                          <span className="font-semibold text-slate-900">
                            {activity.end
                              ? parseLocalDate(activity.end).toLocaleDateString(
                                  'pt-BR',
                                )
                              : 'Não definido'}
                          </span>
                        </div>
                        {activity?.evidences?.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              Evidências:
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {activity?.evidences?.map((ev, i) => (
                                <EvidencePreview key={i} evidence={ev} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 lg:flex-col">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(index)}
                        className="border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeActivity(index)}
                        className="border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredActivities.length === 0 && (
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Nenhuma atividade encontrada
                </h3>
                <p className="text-slate-600 mb-6">
                  {search || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca para encontrar atividades.'
                    : 'Comece criando sua primeira atividade para este projeto.'}
                </p>
                {!search && statusFilter === 'all' && (
                  <Button
                    onClick={openNewDialog}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Atividade
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
