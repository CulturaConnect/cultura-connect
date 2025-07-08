import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  useUpdateProjectMutation,
} from '@/api/projects/projects.queries';
import { Project } from '@/api/projects/types';
import { Plus, Trash2, Pencil, ArrowLeft, Save } from 'lucide-react';

interface ProjectActivity {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: string;
  start: string;
  end: string;
}

const statusOptions = [
  { value: 'novo', label: 'Novo' },
  { value: 'andamento', label: 'Em Andamento' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'atrasado', label: 'Atrasado' },
  { value: 'concluido', label: 'Concluído' },
];

export default function ProjectActivities() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetProjectByIdQuery(projectId);
  const { mutateAsync, isPending } = useUpdateProjectMutation();

  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activityForm, setActivityForm] = useState<ProjectActivity>({
    id: '',
    title: '',
    description: '',
    status: 'novo',
    budget: '',
    start: '',
    end: '',
  });

  useEffect(() => {
    if (data) {
      setActivities(
        data.cronograma_atividades.map((a, idx) => ({
          id: idx.toString(),
          title: a.titulo || '',
          description: a.descricao || '',
          status: a.status || 'novo',
          budget: a.orcamento_previsto || '0',
          start: a.inicio || '',
          end: a.fim || '',
        })),
      );
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">Carregando...</div>
    );
  }

  const totalActivities = activities.length;
  const inProgress = activities.filter((a) => a.status === 'andamento').length;
  const concluded = activities.filter((a) => a.status === 'concluido').length;
  const totalBudget = (data as Project).orcamento_previsto;
  const totalSpent = activities.reduce(
    (acc, a) => acc + parseFloat(a.budget || '0'),
    0,
  );

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
      status: 'novo',
      budget: '',
      start: '',
      end: '',
    });
    setDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    const act = activities[index];
    setEditingIndex(index);
    setActivityForm(act);
    setDialogOpen(true);
  };

  const handleDialogSave = () => {
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
    const payload = {
      cronograma_atividades: activities.map((a) => ({
        titulo: a.title,
        descricao: a.description,
        status: a.status,
        orcamento_previsto: a.budget,
        inicio: a.start,
        fim: a.end,
      })),
    } as Project;

    await mutateAsync({ projectId: data?.id || '', projectData: payload });
  };

  return (
    <div className="min-h-screen flex flex-col pb-4">
      <div className="w-full flex items-center justify-between p-4 border-b bg-white">
        <ArrowLeft
          className="size-5 text-gray-500 cursor-pointer mr-2"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-medium flex-1 text-center">Gerenciar Atividades</h1>
        <Button onClick={handleSave} disabled={isPending} size="sm" className="ml-auto">
          {isPending ? <Save className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span className="sr-only">Salvar</span>
        </Button>
      </div>
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{totalActivities}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Em andamento</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{inProgress}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Concluídas</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{concluded}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Orçamento Total</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              R$ {totalBudget.toLocaleString('pt-BR')}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Gasto</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              R$ {totalSpent.toLocaleString('pt-BR')}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar atividade..."
              className="mt-2"
            />
          </div>
          <div className="w-full sm:w-40">
            <Label htmlFor="filter">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="filter" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
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
              <Button onClick={openNewDialog} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Nova Atividade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingIndex !== null ? 'Editar Atividade' : 'Nova Atividade'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={activityForm.title}
                    onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={activityForm.description}
                    onChange={(e) =>
                      setActivityForm({ ...activityForm, description: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={activityForm.status}
                      onValueChange={(v) => setActivityForm({ ...activityForm, status: v })}
                    >
                      <SelectTrigger id="status" className="mt-2">
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
                  <div>
                    <Label htmlFor="budget">Orçamento</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={activityForm.budget}
                      onChange={(e) => setActivityForm({ ...activityForm, budget: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="start">Início</Label>
                    <Input
                      id="start"
                      type="date"
                      value={activityForm.start}
                      onChange={(e) => setActivityForm({ ...activityForm, start: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end">Fim</Label>
                    <Input
                      id="end"
                      type="date"
                      value={activityForm.end}
                      onChange={(e) => setActivityForm({ ...activityForm, end: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleDialogSave}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {filteredActivities.map((activity, index) => (
            <Card key={activity.id} className="p-4 flex justify-between">
              <div>
                <h4 className="font-semibold">{activity.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                <div className="text-xs text-muted-foreground mt-2 grid grid-cols-2 gap-2">
                  <span>Status: {activity.status}</span>
                  <span>Orçamento: {activity.budget}</span>
                  <span>Início: {activity.start}</span>
                  <span>Fim: {activity.end}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => openEditDialog(index)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeActivity(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
          {filteredActivities.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Nenhuma atividade encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
