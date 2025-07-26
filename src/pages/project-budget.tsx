import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from '@/api/projects/projects.queries';
import type { Project } from '@/api/projects/types';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { CurrencyInput } from '@/components/ui/currency-input';
import { toast } from 'sonner';

interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitQty: number;
  unitValue: number;
  adjustTotal: boolean;
}

export default function ProjectBudget() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetProjectByIdQuery(projectId);
  const { mutateAsync, isPending } = useUpdateProjectMutation();

  const [items, setItems] = useState<BudgetItem[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [spentBudget, setSpentBudget] = useState(0);

  const [form, setForm] = useState({
    description: '',
    quantity: 1,
    unit: '',
    unitQty: 1,
    unitValue: '',
    adjustTotal: false,
  });

  useEffect(() => {
    if (data) {
      setTotalBudget(data.orcamento_previsto || 0);
      setSpentBudget(data.orcamento_gasto || 0);
      // Could load items from API if available
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando orçamento...</p>
        </div>
      </div>
    );
  }

  const remainingBudget = totalBudget - spentBudget;
  const usagePercent = totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0;

  const handleAddItem = () => {
    if (!form.description.trim()) {
      toast.error('Descrição obrigatória');
      return;
    }
    const value = Number(form.unitValue);
    if (isNaN(value)) {
      toast.error('Valor inválido');
      return;
    }
    const qty = Number(form.quantity);
    const total = qty * value;
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      description: form.description,
      quantity: qty,
      unit: form.unit,
      unitQty: form.unitQty,
      unitValue: value,
      adjustTotal: form.adjustTotal,
    };
    setItems([...items, newItem]);
    if (form.adjustTotal) {
      setTotalBudget((prev) => prev + total);
    }
    setForm({ description: '', quantity: 1, unit: '', unitQty: 1, unitValue: '', adjustTotal: false });
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      if (item.adjustTotal) {
        setTotalBudget((prev) => prev - item.quantity * item.unitValue);
      }
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const handleSave = async () => {
    await mutateAsync({
      projectId: data?.id || '',
      projectData: { orcamento_previsto: totalBudget, orcamento_gasto: spentBudget } as Project,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="p-4 sm:p-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-slate-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-xl font-bold text-slate-900">Gerenciar Orçamento</h1>
          <Button onClick={handleSave} disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Salvar
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Orçamento Total</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-green-600">
              R$ {totalBudget.toLocaleString('pt-BR')}
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Orçamento Gasto</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-red-600">
              R$ {spentBudget.toLocaleString('pt-BR')}
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Orçamento Restante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {remainingBudget.toLocaleString('pt-BR')}</p>
              <Progress value={usagePercent} className="h-2" />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between bg-white/70 backdrop-blur-sm p-4 rounded-md shadow">
          <div>Total: R$ {totalBudget.toLocaleString('pt-BR')}</div>
          <div>Gasto: R$ {spentBudget.toLocaleString('pt-BR')}</div>
          <div>Restante: R$ {remainingBudget.toLocaleString('pt-BR')}</div>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <Label htmlFor="desc">Descrição</Label>
              <Input id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="qty">Quantidade</Label>
              <Input id="qty" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Input id="unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="unitValue">Valor Unitário</Label>
              <CurrencyInput id="unitValue" value={form.unitValue} onValueChange={(v) => setForm({ ...form, unitValue: v || '' })} className="mt-2" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input id="adjust" type="checkbox" checked={form.adjustTotal} onChange={(e) => setForm({ ...form, adjustTotal: e.target.checked })} className="mr-2" />
            <Label htmlFor="adjust">Ajustar orçamento total</Label>
          </div>
          <Button onClick={handleAddItem} className="mt-2">Adicionar Item</Button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <Card key={item.id} className="shadow border-0">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-slate-600">
                    {item.quantity} {item.unit} x R$ {item.unitValue.toLocaleString('pt-BR')}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                  Remover
                </Button>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <Card className="shadow border-0">
              <CardContent className="p-4 text-center text-slate-600">
                Nenhum item adicionado
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
