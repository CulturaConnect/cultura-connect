'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
  Upload,
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

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
];

const areaExecucaoSchema = z.object({
  rua: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  observacoes: z.string().optional(),
});

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
  areas_execucao: z.array(areaExecucaoSchema).optional(),
  imagem: z
    .instanceof(File, {
      message: "É necessário enviar uma imagem para o projeto.",
    })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
      `O arquivo da imagem deve ser menor que ${MAX_FILE_SIZE_MB}MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Formato de imagem inválido. Use PNG, JPG, JPEG ou SVG."
    )
    .optional(),
  orcamento_previsto: z.string().optional(),
  orcamento_gasto: z.string().optional(),
  // Modelo Canvas
  modelo: z.object({
    missao: z.string().optional(),
    visao: z.string().optional(),
    mercado: z.string().optional(),
    publico_alvo: z.string().optional(),
    receita: z.string().optional(),
    proposta_valor: z.string().optional(),
    retencao: z.string().optional(),
  }).optional(),
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      areas_execucao: project.areas_execucao || [{
        rua: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        observacoes: "",
      }],
      orcamento_previsto: project.orcamento_previsto?.toString() || "",
      orcamento_gasto: project.orcamento_gasto?.toString() || "",
      imagem: undefined,
      modelo: {
        missao: project.modelo?.missao || "",
        visao: project.modelo?.visao || "",
        mercado: project.modelo?.mercado || "",
        publico_alvo: project.modelo?.publico_alvo || "",
        receita: project.modelo?.receita || "",
        proposta_valor: project.modelo?.proposta_valor || "",
        retencao: project.modelo?.retencao || "",
      },
    },
  });

  const { fields: areaFields, append: appendArea, remove: removeArea } = useFieldArray({
    control: form.control,
    name: "areas_execucao",
  });

  const imageFile = form.watch("imagem");

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  // Definir preview inicial com a imagem do projeto
  useEffect(() => {
    if (project.imagem_url && !imageFile) {
      setImagePreview(project.imagem_url);
    }
  }, [project.imagem_url, imageFile]);

  async function handleCepBlur(index: number, value: string) {
    const cep = value.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.erro) return;
      form.setValue(
        `areas_execucao.${index}.logradouro`,
        data.logradouro || "",
        {
          shouldValidate: true,
        }
      );
      form.setValue(`areas_execucao.${index}.bairro`, data.bairro || "", {
        shouldValidate: true,
      });
      form.setValue(`areas_execucao.${index}.cidade`, data.localidade || "", {
        shouldValidate: true,
      });
      form.setValue(`areas_execucao.${index}.rua`, data.logradouro || "", {
        shouldValidate: true,
      });
      form.setValue(
        `areas_execucao.${index}.complemento`,
        data.complemento || "",
        { shouldValidate: true }
      );
    } catch {
      toast.error("Erro ao buscar CEP. Verifique o número e tente novamente.");
    }
  }

  const onSubmit = async (data: UpdateFormData) => {
    try {
      // Se há imagem, enviar como FormData, senão como objeto JSON
      if (data.imagem) {
        const formData = new FormData();
        
        formData.append('nome', data.nome);
        formData.append('segmento', data.segmento);
        formData.append('inicio', data.inicio);
        formData.append('fim', data.fim);
        formData.append('resumo', data.resumo);
        formData.append('apresentacao', data.apresentacao);
        formData.append('historico', data.historico);
        formData.append('descricao_proposta', data.descricao_proposta);
        formData.append('descricao_contrapartida', data.descricao_contrapartida);
        formData.append('justificativa', data.justificativa);
        formData.append('objetivos_gerais', data.objetivos_gerais);
        formData.append('metas', data.metas);
        formData.append('is_digital', String(data.is_digital));
        formData.append('is_public', String(data.is_public));
        
        if (data.areas_execucao) {
          formData.append('areas_execucao', JSON.stringify(data.areas_execucao));
        }
        
        if (data.modelo) {
          formData.append('modelo', JSON.stringify(data.modelo));
        }
        
        formData.append('imagem', data.imagem);
        
        if (data.orcamento_previsto) {
          const orcamentoPrevisto = parseFloat(data.orcamento_previsto.replace(/[^\d,]/g, '').replace(',', '.'));
          formData.append('orcamento_previsto', String(orcamentoPrevisto));
        }
        
        if (data.orcamento_gasto) {
          const orcamentoGasto = parseFloat(data.orcamento_gasto.replace(/[^\d,]/g, '').replace(',', '.'));
          formData.append('orcamento_gasto', String(orcamentoGasto));
        }

        await updateProject({
          projectId: project.id,
          projectData: formData,
        });
      } else {
        // Sem imagem, enviar como objeto JSON
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
          areas_execucao: data.areas_execucao,
          modelo: data.modelo,
          orcamento_previsto: data.orcamento_previsto ? parseFloat(data.orcamento_previsto.replace(/[^\d,]/g, '').replace(',', '.')) : undefined,
          orcamento_gasto: data.orcamento_gasto ? parseFloat(data.orcamento_gasto.replace(/[^\d,]/g, '').replace(',', '.')) : undefined,
        };

        await updateProject({
          projectId: project.id,
          projectData: updateData,
        });
      }

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
                                  <SelectItem value="teatro">Teatro</SelectItem>
                                  <SelectItem value="danca">Dança</SelectItem>
                                  <SelectItem value="musica">Música</SelectItem>
                                  <SelectItem value="poema">Poema</SelectItem>
                                  <SelectItem value="cinema">Cinema</SelectItem>
                                  <SelectItem value="seminarios">Seminários</SelectItem>
                                  <SelectItem value="games">Games</SelectItem>
                                  <SelectItem value="pintura">Pintura</SelectItem>
                                  <SelectItem value="folclore">Folclore</SelectItem>
                                  <SelectItem value="outro">Outro</SelectItem>
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

        {/* Upload de Imagem */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Imagem do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center w-full">
              {imagePreview ? (
                <div className="relative w-full h-64 overflow-hidden rounded-lg border-2 border-gray-300">
                  <img
                    src={imagePreview}
                    alt="Preview da imagem"
                    className="object-cover w-full h-full"
                  />
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        form.setValue("imagem", selectedFile, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                </div>
              ) : (
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Clique para fazer upload</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG, JPEG (máx. 10MB)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        form.setValue("imagem", selectedFile, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Endereço Físico - Condicional */}
        {!form.watch("is_digital") && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
              <CardTitle className="text-xl">Áreas de Execução</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {areaFields.map((areaField, index) => (
                  <div
                    key={areaField.id}
                    className="flex flex-col gap-4 items-start border p-4 rounded-md"
                  >
                    <h5 className="font-semibold">Área {index + 1}</h5>
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <FormField
                        control={form.control}
                        name={`areas_execucao.${index}.cep`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="CEP"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleCepBlur(index, e.target.value);
                                }}
                                onBlur={(e) => {
                                  field.onBlur();
                                  handleCepBlur(index, e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`areas_execucao.${index}.rua`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Rua</FormLabel>
                            <FormControl>
                              <Input placeholder="Rua" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                      <FormField
                        control={form.control}
                        name={`areas_execucao.${index}.logradouro`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logradouro</FormLabel>
                            <FormControl>
                              <Input placeholder="Logradouro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`areas_execucao.${index}.numero`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                              <Input placeholder="Número" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`areas_execucao.${index}.complemento`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Complemento</FormLabel>
                          <FormControl>
                            <Input placeholder="Complemento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4 w-full">
                      <FormField
                        control={form.control}
                        name={`areas_execucao.${index}.bairro`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                              <Input placeholder="Bairro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`areas_execucao.${index}.cidade`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Cidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`areas_execucao.${index}.observacoes`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Observações sobre a área de execução..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {areaFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeArea(index)}
                      >
                        Remover área
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendArea({
                      rua: "",
                      cep: "",
                      logradouro: "",
                      numero: "",
                      complemento: "",
                      bairro: "",
                      cidade: "",
                      observacoes: "",
                    })
                  }
                >
                  Adicionar área
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Modelo de Negócio Canvas */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
            <CardTitle className="text-xl">Modelo de Negócio Canvas</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="modelo.missao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Missão</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Qual é a missão do projeto?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelo.visao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visão</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Qual é a visão do projeto?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelo.proposta_valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposta de Valor</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Qual é a proposta de valor?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelo.publico_alvo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Público-Alvo</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Quem é o público-alvo?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelo.mercado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mercado</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Como é o mercado?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelo.receita"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo de Receita</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Como gerar receita?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelo.retencao"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 lg:col-span-3">
                    <FormLabel>Estratégia de Retenção</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Como reter e fidelizar o público?"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

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