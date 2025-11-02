'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { CurrencyInput } from '../ui/currency-input';
import {
  Calendar,
  MapPin,
  Target,
  Users,
  Edit3,
  Save,
  X,
  Eye,
  Heart,
  TrendingUp,
  Gift,
  DollarSign,
  Monitor,
  Wifi,
  Repeat,
  Loader2,
} from "lucide-react";
import { Project, UpdateProject } from "@/api/projects/types";
import { useUpdateProjectMutation } from "@/api/projects/projects.queries";
import { toast } from "@/components/ui/sonner";
import { formatDateToPTBR } from "@/utils/date";

function getSegmentColor(segmento: string) {
  const colors: Record<string, string> = {
    musica: "bg-purple-100 text-purple-800 border-purple-200",
    teatro: "bg-red-100 text-red-800 border-red-200",
    danca: "bg-pink-100 text-pink-800 border-pink-200",
    artes: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return colors[segmento] || "bg-gray-100 text-gray-800 border-gray-200";
}

// Função para converter data ISO para formato de input date (YYYY-MM-DD)
function formatDateForInput(dateString: string): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    // Verifica se a data é válida
    if (isNaN(date.getTime())) return "";
    
    // Converte para YYYY-MM-DD
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
}

const updateSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  segmento: z.string().min(1, "Segmento é obrigatório"),
  inicio: z.string().min(1, "Data de início é obrigatória"),
  fim: z.string().min(1, "Data de fim é obrigatória"),
  resumo: z.string().min(1, "Resumo é obrigatório"),
  apresentacao: z.string().min(1, "Apresentação é obrigatória"),
  historico: z.string().min(1, "Histórico é obrigatório"),
  descricao_proposta: z.string().min(1, "Descrição da proposta é obrigatória"),
  descricao_contrapartida: z.string().min(1, "Descrição da contrapartida é obrigatória"),
  justificativa: z.string().min(1, "Justificativa é obrigatória"),
  objetivos_gerais: z.string().min(1, "Objetivos gerais são obrigatórios"),
  metas: z.string().min(1, "Metas são obrigatórias"),
  is_digital: z.boolean(),
  is_public: z.boolean(),
  orcamento_previsto: z.string().optional(),
  orcamento_gasto: z.string().optional(),
}).refine((data) => new Date(data.fim) >= new Date(data.inicio), {
  message: "Data de fim deve ser igual ou posterior à data de início",
  path: ["fim"],
});

type UpdateFormData = z.infer<typeof updateSchema>;

interface EditableProjectDetailsProps {
  project: Project;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export default function EditableProjectDetails({ 
  project, 
  isEditing, 
  onToggleEdit 
}: EditableProjectDetailsProps) {
  const { mutateAsync: updateProject, isPending } = useUpdateProjectMutation();

  const form = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      nome: project.nome,
      segmento: project.segmento,
      inicio: formatDateForInput(project.inicio),
      fim: formatDateForInput(project.fim),
      resumo: project.resumo,
      apresentacao: project.apresentacao,
      historico: project.historico,
      descricao_proposta: project.descricao_proposta,
      descricao_contrapartida: project.descricao_contrapartida,
      justificativa: project.justificativa,
      objetivos_gerais: project.objetivos_gerais,
      metas: project.metas,
      is_digital: project.is_digital,
      is_public: project.is_public,
      orcamento_previsto: project.orcamento_previsto?.toString() || "",
      orcamento_gasto: project.orcamento_gasto?.toString() || "",
    },
  });

  const onSubmit = async (data: UpdateFormData) => {
    try {
      const updateData: UpdateProject = {
        nome: data.nome,
        segmento: data.segmento,
        inicio: data.inicio,
        fim: data.fim,
        resumo: data.resumo,
        apresentacao: data.apresentacao,
        historico: data.historico,
        descricao_proposta: data.descricao_proposta,
        descricao_contrapartida: data.descricao_contrapartida,
        justificativa: data.justificativa,
        objetivos_gerais: data.objetivos_gerais,
        metas: data.metas,
        is_digital: data.is_digital,
        is_public: data.is_public,
        orcamento_previsto: data.orcamento_previsto ? parseFloat(data.orcamento_previsto.replace(/[^\d,]/g, '').replace(',', '.')) : undefined,
        orcamento_gasto: data.orcamento_gasto ? parseFloat(data.orcamento_gasto.replace(/[^\d,]/g, '').replace(',', '.')) : undefined,
      };

      await updateProject({
        projectId: project.id,
        projectData: updateData,
      });

      toast.success("Projeto atualizado com sucesso!");
      onToggleEdit();
    } catch (error) {
      toast.error("Erro ao atualizar projeto");
      console.error(error);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <Card className="overflow-hidden border-0 shadow-xl bg-white">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
            <CardContent className="relative p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                    <img
                      src={project.imagem_url || "/placeholder.svg"}
                      alt={project.nome}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {project.nome}
                      </h1>
                      <Badge
                        className={`w-fit ${getSegmentColor(project.segmento)}`}
                      >
                        {project.segmento}
                      </Badge>
                    </div>
                    <Button
                      onClick={onToggleEdit}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Editar Projeto
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDateToPTBR(project.inicio)} até{" "}
                        {formatDateToPTBR(project.fim)}
                      </span>
                    </div>
                    {project.is_digital ? (
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4" />
                        <span>Projeto Digital</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Projeto Físico</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Informações do Projeto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-xl">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.resumo}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="text-xl">Apresentação</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.apresentacao}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
              <CardTitle className="text-xl">Histórico</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.historico}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="text-xl">Descrição da Proposta</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.descricao_proposta}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b">
              <CardTitle className="text-xl">Descrição da Contrapartida</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.descricao_contrapartida}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b">
              <CardTitle className="text-xl">Justificativa</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.justificativa}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
              <CardTitle className="text-xl">Objetivos Gerais</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.objetivos_gerais}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
              <CardTitle className="text-xl">Metas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.metas}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orçamento */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="w-5 h-5 text-green-600" />
              Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Orçamento Previsto</h3>
                <p className="text-2xl font-bold text-green-600">
                  {project.orcamento_previsto
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(project.orcamento_previsto)
                    : "Não informado"}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Orçamento Gasto</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {project.orcamento_gasto
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(project.orcamento_gasto)
                    : "Não informado"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Header editável */}
        <Card className="overflow-hidden border-0 shadow-xl bg-white">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
            <CardContent className="relative p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                    <img
                      src={project.imagem_url || "/placeholder.svg"}
                      alt={project.nome}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-4 flex-1">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do Projeto</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="text-2xl font-bold"
                                placeholder="Nome do projeto"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="segmento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Segmento</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o segmento" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="musica">Música</SelectItem>
                                  <SelectItem value="teatro">Teatro</SelectItem>
                                  <SelectItem value="danca">Dança</SelectItem>
                                  <SelectItem value="artes">Artes Visuais</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="inicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Início</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fim"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Fim</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="is_digital"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Projeto Digital</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_public"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Projeto Público</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Campos editáveis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-xl">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="resumo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Resumo do projeto..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="text-xl">Apresentação</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="apresentacao"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Apresentação do projeto..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
              <CardTitle className="text-xl">Histórico</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="historico"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Histórico do projeto..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="text-xl">Descrição da Proposta</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="descricao_proposta"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descrição da proposta..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b">
              <CardTitle className="text-xl">Descrição da Contrapartida</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="descricao_contrapartida"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descrição da contrapartida..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b">
              <CardTitle className="text-xl">Justificativa</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="justificativa"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Justificativa do projeto..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
              <CardTitle className="text-xl">Objetivos Gerais</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="objetivos_gerais"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Objetivos gerais do projeto..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
              <CardTitle className="text-xl">Metas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="metas"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Metas do projeto..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Orçamento editável */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="w-5 h-5 text-green-600" />
              Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="orcamento_previsto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orçamento Previsto</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onValueChange={(value) => field.onChange(value ?? "")}
                        onBlur={field.onBlur}
                        name={field.name}
                        placeholder="R$ 0,00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orcamento_gasto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orçamento Gasto</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onValueChange={(value) => field.onChange(value ?? "")}
                        onBlur={field.onBlur}
                        name={field.name}
                        placeholder="R$ 0,00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Barra de ações */}
        <div className="sticky bottom-0 bg-white border rounded-xl shadow-lg border-gray-200 p-4 mt-8">
          <div className="flex justify-end gap-4 max-w-7xl mx-auto">
            <Button
              type="button"
              onClick={onToggleEdit}
              variant="outline"
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}