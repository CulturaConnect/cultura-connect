import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  useGetBudgetItemsQuery,
  useGetProjectByIdQuery,
  useUpdateBudgetItemMutation,
} from '@/api/projects/projects.queries';
import {
  ArrowLeft,
  Save,
  Loader2,
  ArrowRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { CurrencyInput } from '@/components/ui/currency-input';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import ReactPaginate from 'react-paginate';
import { cn } from '@/lib/utils';
import { formatCurrencyToPTBR } from '@/utils/date';

export interface BudgetItem {
  id?: string;
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

  const { data: budgetItems = [], isLoading: isLoadingBudgetItems } =
    useGetBudgetItemsQuery(projectId || '');

  const { mutateAsync, isPending } = useUpdateBudgetItemMutation();

  const [items, setItems] = useState<BudgetItem[]>([]);
  const [spentBudget, setSpentBudget] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalItems, setOriginalItems] = useState<BudgetItem[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const pageCount = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(0); // reset ao adicionar/remover
  }, [items.length]);

  useEffect(() => {
    if (budgetItems.length > 0) {
      setItems(budgetItems);
      setOriginalItems(JSON.parse(JSON.stringify(budgetItems)));
    }
  }, [budgetItems]);

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
      setSpentBudget(data.orcamento_gasto || 0);
      // Could load items from API if available
    }
  }, [data]);

  // Detectar mudanças não salvas
  useEffect(() => {
    const itemsChanged = JSON.stringify(items) !== JSON.stringify(originalItems);
    setHasUnsavedChanges(itemsChanged);
  }, [items, originalItems]);

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
    setItems(JSON.parse(JSON.stringify(originalItems)));
    setHasUnsavedChanges(false);
    toast.success('Alterações canceladas');
  }, [originalItems]);

  if (isLoading || isLoadingBudgetItems) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando orçamento...</p>
        </div>
      </div>
    );
  }

  // Calcular total dos itens que adicionam ao orçamento (adjustTotal = true) - usando estado local
  const totalAdicionado = items
    .filter((item) => item.adjustTotal)
    .reduce((acc, item) => {
      const q = item.quantity || 0;
      const u = item.unitQty || 0;
      const v = item.unitValue || 0;
      return acc + Math.max(0, q * u * v);
    }, 0);

  // Calcular total dos itens que subtraem do orçamento (adjustTotal = false) - usando estado local
  const totalSubtraido = items
    .filter((item) => !item.adjustTotal)
    .reduce((acc, item) => {
      const q = item.quantity || 0;
      const u = item.unitQty || 0;
      const v = item.unitValue || 0;
      return acc + Math.max(0, q * u * v);
    }, 0);

  // Orçamento base = orçamento previsto original do projeto
  const orcamentoBase = data?.orcamento_previsto || 0;
  
  // Orçamento total = base + itens que incrementam (adjustTotal=true)
  const orcamentoTotal = orcamentoBase + totalAdicionado;
  
  // Calcular itens não salvos que subtraem do orçamento (para UX imediato)
  const itensNaoSalvosSubtraidos = items
    .filter((item) => !item.adjustTotal && !item.id) // apenas itens locais não salvos
    .reduce((acc, item) => {
      const q = item.quantity || 0;
      const u = item.unitQty || 0;
      const v = item.unitValue || 0;
      return acc + Math.max(0, q * u * v);
    }, 0);
  
  // Orçamento gasto total = gasto da API + itens locais não salvos que subtraem
  const orcamentoGastoTotal = spentBudget + itensNaoSalvosSubtraidos;
  
  const remainingBudget = orcamentoTotal - orcamentoGastoTotal;
  const usagePercent = orcamentoTotal > 0 ? (orcamentoGastoTotal / orcamentoTotal) * 100 : 0;

  const handleAddItem = () => {
    if (!form.description.trim()) {
      toast.error('Descrição obrigatória');
      return;
    }

    if (!form.unit.trim()) {
      toast.error('Unidade obrigatória');
      return;
    }

    const qty = Number(form.quantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error('Quantidade inválida');
      return;
    }

    const unitQty = Number(form.unitQty);
    if (isNaN(unitQty) || unitQty <= 0) {
      toast.error('Quantidade unidade inválida');
      return;
    }

    const value = Number(form.unitValue);
    if (isNaN(value) || value <= 0) {
      toast.error('Valor unitário inválido');
      return;
    }

    const total = qty * unitQty * value;

    const newItem: BudgetItem = {
      description: form.description,
      quantity: qty,
      unit: form.unit,
      unitQty: form.unitQty,
      unitValue: value,
      adjustTotal: form.adjustTotal,
    };

    setItems([...items, newItem]);

    setForm({
      description: '',
      quantity: 1,
      unit: '',
      unitQty: 1,
      unitValue: '',
      adjustTotal: false,
    });
  };

  const removeItem = (index: number) => {
    const item = items[index];
    if (item) {
      setItems(items.filter((_, idx) => idx !== index));
    }
  };

  const handleSave = async () => {
    try {
      await mutateAsync({
        projectId: data?.id || '',
        data: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unitQty: item.unitQty,
          unitValue: item.unitValue,
          adjustTotal: item.adjustTotal,
        })),
      });

      // Atualizar o estado original após salvar com sucesso
      setOriginalItems(JSON.parse(JSON.stringify(items)));
      setHasUnsavedChanges(false);
      toast.success('Alterações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar alterações');
    }
  };

  const unitValue = Number(form.unitValue);
  const quantity = Number(form.quantity);
  const unitQty = Number(form.unitQty);
  const subtotal =
    !isNaN(unitValue) && !isNaN(quantity) && !isNaN(unitQty)
      ? unitValue * quantity * unitQty
      : 0;



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="p-4 sm:p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackNavigation}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-xl font-bold text-slate-900">
            Gerenciar Orçamento
          </h1>
          <div className="flex gap-3">
            {hasUnsavedChanges && (
              <Button
                onClick={handleCancelChanges}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Cancelar
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={isPending || !hasUnsavedChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Orçamento Total</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-green-600">
              {formatCurrencyToPTBR(orcamentoTotal)}
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Orçamento Gasto</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-red-600">
              {formatCurrencyToPTBR(orcamentoGastoTotal)}
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Orçamento Restante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p
                className={`text-2xl font-bold ${
                  remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrencyToPTBR(remainingBudget)}
              </p>
              <Progress value={usagePercent} className="h-2" />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between bg-white/70 backdrop-blur-sm p-4 rounded-md shadow">
          <div>
            <h4 className="text-lg font-semibold text-slate-800">
              Resumo do Orçamento
            </h4>
          </div>

          <div className="flex items-center gap-4">
            <Badge >
              Orçamento Base: {formatCurrencyToPTBR(orcamentoBase)}
            </Badge>
            {/* <Badge>Total: {formatCurrencyToPTBR(totalBudget)}</Badge>
            <Badge>Gasto: {formatCurrencyToPTBR(spentBudget)}</Badge>
            <Badge variant={remainingBudget >= 0 ? 'secondary' : 'destructive'}>
              Restante: {formatCurrencyToPTBR(remainingBudget)}
            </Badge> */}
          </div>
        </div>

        <div className="space-y-4 bg-white/70 backdrop-blur-sm p-4 rounded-md shadow">
          <div className="grid md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-2">
              <Label htmlFor="desc">Descrição</Label>
              <Input
                id="desc"
                value={form.description}
                placeholder='Ex: "Material de escritório", "Serviços de limpeza"'
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="qty">Quantidade</Label>
              <Input
                id="qty"
                type="number"
                value={form.quantity}
                placeholder='Ex: "10", "5.5"'
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="unitQty">Quantidade Unidade</Label>
              <Input
                id="unitQty"
                type="number"
                value={form.unitQty}
                placeholder="1"
                onChange={(e) =>
                  setForm({ ...form, unitQty: Number(e.target.value) })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Input
                id="unit"
                value={form.unit}
                placeholder='Ex: "kg", "un", "m²"'
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="unitValue">Valor Unitário</Label>
              <CurrencyInput
                id="unitValue"
                value={form.unitValue}
                placeholder="R$ 0,00"
                onValueChange={(v) => setForm({ ...form, unitValue: v || '' })}
                className="mt-2"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              id="adjust"
              type="checkbox"
              checked={form.adjustTotal}
              onChange={(e) =>
                setForm({ ...form, adjustTotal: e.target.checked })
              }
              className="mr-2"
            />
            <Label htmlFor="adjust">Incrementar orçamento total</Label>
          </div>

          <div className="flex justify-end flex-col">
            {subtotal > 0 && (
            <p className="text-right text-md text-slate-700 font-medium">
              Subtotal:{' '}
              <span className={cn(
                "font-semibold",
                form.adjustTotal ? "text-green-600" : "text-red-600"
              )}>
                {formatCurrencyToPTBR(subtotal)}
              </span>
            </p>
          )}

            <Button
              onClick={handleAddItem}
              className="w-40"
              variant="secondary"
            >
              Adicionar Item
            </Button>
          </div>
        </div>

        <div className="overflow-auto rounded-md shadow border border-slate-200">
          <table className="min-w-full bg-white text-sm text-slate-700">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="text-left p-3 font-semibold">Descrição</th>
                <th className="text-left p-3 font-semibold">Qtd.</th>
                <th className="text-left p-3 font-semibold">Qtd. Unidade</th>
                <th className="text-left p-3 font-semibold">Unidade</th>
                <th className="text-left p-3 font-semibold">Valor Unit.</th>
                <th className="text-left p-3 font-semibold">Subtotal</th>
                <th className="text-right p-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item, idx) => (
                  <tr key={item.id || idx} className="border-b last:border-0">
                    <td className="p-3">{item.description}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{item.unitQty}</td>
                    <td className="p-3">{item.unit}</td>
                    <td className="p-3">
                      {formatCurrencyToPTBR(item.unitValue)}
                    </td>

                    <td
                      className={cn(
                        'p-3 font-semibold ',
                        item.adjustTotal ? 'text-green-600' : 'text-red-600',
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {formatCurrencyToPTBR(
                          item.quantity *
                          item.unitQty *
                          item.unitValue
                        )}
                        {item.adjustTotal ? (
                          <ChevronUp size={17} />
                        ) : (
                          <ChevronDown size={17} />
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        size="sm"
                        onClick={() => removeItem(idx)}
                      >
                        Remover
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-slate-500 py-4">
                    {spentBudget > 0 ? 'Nenhum item adicional adicionado' : 'Nenhum item adicionado'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={<ArrowLeft className="w-4 h-4" />}
            nextLabel={<ArrowRight className="w-4 h-4" />}
            breakLabel={'...'}
            pageCount={pageCount}
            onPageChange={(selected) => setCurrentPage(selected.selected)}
            containerClassName="flex justify-center mt-4 gap-2"
            pageClassName="px-3 py-1 border rounded-md text-sm text-slate-700 hover:bg-slate-100"
            activeClassName="bg-blue-600 text-white"
            previousClassName="px-3 py-1 text-sm hover:bg-slate-100"
            nextClassName="px-3 py-1 text-sm hover:bg-slate-100"
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        )}
      </div>
    </div>
  );
}
