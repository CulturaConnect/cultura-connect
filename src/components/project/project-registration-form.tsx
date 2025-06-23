'use client';

import { useEffect, useState, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Target,
  Eye,
  Users,
  DollarSign,
  Gift,
  TrendingUp,
  Repeat,
  UploadIcon,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useGetCompanyUsers } from '@/api/companies/companies.queries';
import { useAuth } from '@/contexts/auth';
import { useCreateProjectMutation } from '@/api/projects/projects.queries';

const modeloSchema = z.object({
  missao: z.string().min(1, 'Campo obrigatório'),
  visao: z.string().min(1, 'Campo obrigatório'),
  mercado: z.string().min(1, 'Campo obrigatório'),
  publico_alvo: z.string().min(1, 'Campo obrigatório'),
  receita: z.string().min(1, 'Campo obrigatório'),
  proposta_valor: z.string().min(1, 'Campo obrigatório'),
  retencao: z.string().min(1, 'Campo obrigatório'),
});

const areaExecucaoSchema = z.object({
  rua: z.string().min(1, 'Rua é obrigatória'),
  cep: z.string().min(8, 'CEP deve ter pelo menos 8 dígitos'),
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
});

const cronogramaSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
});

const equipeSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  funcao: z.string().min(1, 'Função é obrigatória'),
  cpf_cnpj: z.string().min(11, 'CPF/CNPJ inválido'),
});

function createBaseSchema(isCompany: boolean) {
  return z.object({
    nome: z.string().min(2, 'Nome do projeto é obrigatório'),
    segmento: z.string().min(1, 'Segmento é obrigatório'),
    inicio: z.string().min(1, 'Data de início é obrigatória'),
    fim: z.string().min(1, 'Data de fim é obrigatória'),
    imagem: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, 'Arquivo maior que 10MB')
      .refine(
        (file) =>
          ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'].includes(
            file.type,
          ),
        'Formato inválido',
      ),
    modelo: modeloSchema,
    titulo_oficial: z.string().min(2, 'Título oficial é obrigatório'),
    areas_execucao: z
      .array(areaExecucaoSchema)
      .min(1, 'Pelo menos uma área de execução é obrigatória'),
    resumo: z.string().min(10, 'Resumo é obrigatório'),
    objetivos_gerais: z.string().min(10, 'Objetivos gerais são obrigatórios'),
    metas: z.string().min(10, 'Metas são obrigatórias'),
    cronograma_atividades: z
      .array(cronogramaSchema)
      .min(1, 'Cronograma é obrigatório'),
    orcamento_previsto: z.string().min(1, 'Orçamento previsto é obrigatório'),
    orcamento_gasto: z.string().optional(),
    responsavel_principal_id: isCompany
      ? z.string().min(1, 'Responsável principal é obrigatório')
      : z.string().optional(),
    equipe: z.array(equipeSchema).optional(),
    responsavel_legal_id: isCompany
      ? z.string().min(1, 'Responsável legal é obrigatório')
      : z.string().optional(),
  });
}

type FormData = z.infer<ReturnType<typeof createBaseSchema>>;

const modelCards = [
  {
    id: 'missao',
    area: 'area-missao',
    title: 'Missão',
    description: 'O propósito e razão de ser da empresa',
    icon: Target,
    color: 'bg-blue-100 text-blue-800',
    content: '...',
  },
  {
    id: 'visao',
    area: 'area-visao',
    title: 'Visão',
    description: 'As metas a longo prazo',
    icon: Eye,
    color: 'bg-green-100 text-green-800',
    content: '...',
  },
  {
    id: 'mercado',
    area: 'area-mercado',
    title: 'Mercado',
    description: 'A posição da empresa perante a concorrência',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-800',
    content: '...',
  },
  {
    id: 'publico_alvo',
    area: 'area-publico',
    title: 'Público-alvo',
    description: 'Os clientes que a empresa atende',
    icon: Users,
    color: 'bg-pink-100 text-pink-800',
    content: '...',
  },
  {
    id: 'receita',
    area: 'area-receita',
    title: 'Receita',
    description: 'Rentabilização do comportamento',
    icon: DollarSign,
    color: 'bg-blue-100 text-blue-800',
    content: '...',
  },
  {
    id: 'proposta_valor',
    area: 'area-proposta',
    title: 'Proposta de valor',
    description: 'Benefícios e diferenciais únicos',
    icon: Gift,
    color: 'bg-orange-100 text-orange-800',
    content: '...',
  },
  {
    id: 'retencao',
    area: 'area-retencao',
    title: 'Retenção',
    description: 'O que fazer para os usuários retornarem',
    icon: Repeat,
    color: 'bg-green-100 text-green-800',
    content: '...',
  },
];

export default function ProjectRegistrationForm() {
  const { user } = useAuth();
  const isCompany = user?.tipo === 'company';
  const baseSchema = useMemo(() => createBaseSchema(isCompany), [isCompany]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isStepValid, setIsStepValid] = useState(false);
  const [legalResponsible, setLegalResponsible] = useState({
    responsibleName: '',
    phone: '',
    email: '',
  });

  const [primaryResponsible, setPrimaryResponsible] = useState({
    cpf: '',
  });

  const form = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      nome: '',
      segmento: '',
      inicio: '',
      fim: '',
      modelo: {
        missao: '',
        visao: '',
        mercado: '',
        publico_alvo: '',
        receita: '',
        proposta_valor: '',
        retencao: '',
      },
      titulo_oficial: '',
      areas_execucao: [
        {
          rua: '',
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
        },
      ],
      resumo: '',
      objetivos_gerais: '',
      metas: '',
      orcamento_previsto: '',
      orcamento_gasto: '',
      cronograma_atividades: [
        {
          titulo: '',
          descricao: '',
        },
      ],
      responsavel_principal_id: '',
      equipe: [
        {
          nome: '',
          funcao: '',
          cpf_cnpj: '',
        },
      ],
      responsavel_legal_id: '',
    },
  });

  const imageFile = form.watch('imagem');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { control } = form;

  const { data } = useGetCompanyUsers(user?.id || '');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cronograma_atividades',
  });

  const {
    fields: areaFields,
    append: appendArea,
    remove: removeArea,
  } = useFieldArray({
    control,
    name: 'areas_execucao',
  });

  const {
    fields: equipeFields,
    append: appendEquipe,
    remove: removeEquipe,
  } = useFieldArray({
    control,
    name: 'equipe',
  });

  const validateStep = async () => {
    const values = form.getValues();

    try {
      const stepSchema = isCompany
        ? {
            1: baseSchema.pick({
              nome: true,
              segmento: true,
              inicio: true,
              fim: true,
            }),
            2: baseSchema.pick({ modelo: true }),
            3: baseSchema.pick({ responsavel_legal_id: true }),
            4: baseSchema.pick({
              titulo_oficial: true,
              areas_execucao: true,
              resumo: true,
            }),
            5: baseSchema.pick({
              objetivos_gerais: true,
              metas: true,
              cronograma_atividades: true,
              orcamento_previsto: true,
              orcamento_gasto: true,
            }),
            6: baseSchema.pick({
              responsavel_principal_id: true,
              equipe: true,
            }),
          }
        : {
            1: baseSchema.pick({
              nome: true,
              segmento: true,
              inicio: true,
              fim: true,
            }),
            2: baseSchema.pick({ modelo: true }),
            3: baseSchema.pick({
              titulo_oficial: true,
              areas_execucao: true,
              resumo: true,
            }),
            4: baseSchema.pick({
              objetivos_gerais: true,
              metas: true,
              cronograma_atividades: true,
              orcamento_previsto: true,
              orcamento_gasto: true,
            }),
            5: baseSchema.pick({ equipe: true }),
          };

      await stepSchema[currentStep].parseAsync(values);
      setIsStepValid(true);
    } catch {
      setIsStepValid(false);
    }
  };

  const { mutateAsync, isPending } = useCreateProjectMutation();

  const onSubmit = async (values: FormData) => {
    await mutateAsync(values);
  };

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

  useEffect(() => {
    validateStep();
  }, [form.watch(), currentStep]);

  const totalSteps = isCompany ? 6 : 5;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex flex-wrap justify-center gap-4 mb-4">
      {Array.from({ length: totalSteps }, (_, idx) => idx + 1).map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
              step === currentStep
                ? 'bg-blue-500 text-white scale-110 shadow-md'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
          {index < 5 && (
            <div
              className={`hidden sm:block w-12 h-0.5 transition-colors duration-200 ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do projeto *</FormLabel>
            <FormControl>
              <Input placeholder="Nome do projeto" {...field} />
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
            <FormLabel>Segmento *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o segmento" />
                </SelectTrigger>
              </FormControl>
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
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="inicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Início</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
              <FormLabel>Fim</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
                  form.setValue('imagem', selectedFile, {
                    shouldValidate: true,
                  });
                }
              }}
            />
          </div>
        ) : (
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon className="w-10 h-10 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Clique para fazer upload</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
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
                  form.setValue('imagem', selectedFile, {
                    shouldValidate: true,
                  });
                }
              }}
            />
          </label>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-areas-canvas max-w-5xl mx-auto px-4">
          {' '}
          {modelCards.map((model) => {
            const Icon = model.icon;

            return (
              <Drawer key={model.id}>
                <DrawerTrigger asChild>
                  <Card
                    className={cn(
                      `rounded-md p-4 border shadow-sm`,
                      model.area,
                      model.color,
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${model.color}`}>
                          <Icon className={cn('h-5 w-5', model.color)} />
                        </div>
                        <div>
                          <CardTitle className="text-sm">
                            {model.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {model.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </DrawerTrigger>
                <DrawerContent className="min-h-[350px] flex flex-col">
                  <DrawerHeader>
                    <DrawerTitle>{model.title}</DrawerTitle>
                    <DrawerDescription>{model.description}</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 flex-1 flex flex-col">
                    <Textarea
                      onChange={(e) =>
                        form.setValue(
                          `modelo.${model.id}` as
                            | `modelo.missao`
                            | `modelo.visao`
                            | `modelo.mercado`
                            | `modelo.publico_alvo`
                            | `modelo.receita`
                            | `modelo.proposta_valor`
                            | `modelo.retencao`,
                          e.target.value,
                        )
                      }
                      placeholder="Descreva aqui..."
                      className="flex-1"
                      value={form.watch(
                        `modelo.${model.id}` as
                          | 'modelo.missao'
                          | 'modelo.visao'
                          | 'modelo.mercado'
                          | 'modelo.publico_alvo'
                          | 'modelo.receita'
                          | 'modelo.proposta_valor'
                          | 'modelo.retencao',
                      )}
                    />
                  </div>
                </DrawerContent>
              </Drawer>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="responsavel_legal_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Responsável legal do projeto</FormLabel>
            <Select
              onValueChange={(e) => {
                field.onChange(e);
                const selectedUser = data?.find((user) => user.id === e);
                if (selectedUser) {
                  setLegalResponsible({
                    responsibleName: selectedUser.nome_completo,
                    phone: selectedUser.telefone,
                    email: selectedUser.email,
                  });
                }
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável legal" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.nome_completo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormItem>
          <FormLabel>Nome</FormLabel>
          <FormControl>
            <Input disabled value={legalResponsible.responsibleName} readOnly />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Telefone</FormLabel>
          <FormControl>
            <Input disabled value={legalResponsible.phone} readOnly />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>E-mail</FormLabel>
          <FormControl>
            <Input disabled value={legalResponsible.email} readOnly />
          </FormControl>
          <FormMessage />
        </FormItem>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="titulo_oficial"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título oficial do projeto</FormLabel>
            <FormControl>
              <Input placeholder="Título oficial" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="areas_execucao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Área(s) de execução</FormLabel>

            <div className="space-y-4">
              {areaFields.map((areaField, index) => (
                <div
                  key={areaField.id}
                  className="flex flex-col gap-4 items-start border p-4 rounded-md"
                >
                  <h5>Área {index + 1}</h5>
                  <div className="grid grid-cols-2 gap-4 w-full">
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

                    <FormField
                      control={form.control}
                      name={`areas_execucao.${index}.cep`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input placeholder="CEP" {...field} />
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

                  {areaFields.length > 1 && (
                    <Button
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
                    rua: '',
                    cep: '',
                    logradouro: '',
                    numero: '',
                    complemento: '',
                    bairro: '',
                    cidade: '',
                  })
                }
              >
                Adicionar área
              </Button>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="resumo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Resumo do projeto</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva o resumo do projeto..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="objetivos_gerais"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objetivos gerais</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva os objetivos gerais..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Metas</FormLabel>

            <FormControl>
              <Textarea
                placeholder="Descreva as metas..."
                className="min-h-[120px]"
                value={typeof field.value === 'string' ? field.value : ''}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cronograma_atividades"
        render={() => (
          <FormItem>
            <FormLabel>Cronograma de atividades</FormLabel>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-4 items-start border p-4 rounded-md"
                >
                  <h5>Atividade {index + 1}</h5>
                  <FormField
                    control={form.control}
                    name={`cronograma_atividades.${index}.titulo`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel
                          htmlFor={`cronograma_atividades.${index}.titulo`}
                        >
                          Título da atividade
                        </FormLabel>
                        <FormControl>
                          <Input
                            id={`cronograma_atividades.${index}.titulo`}
                            {...field}
                            placeholder="Título da atividade"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`cronograma_atividades.${index}.descricao`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel
                          htmlFor={`cronograma_atividades.${index}.descricao`}
                        >
                          Descrição da atividade
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            id={`cronograma_atividades.${index}.descricao`}
                            {...field}
                            placeholder="Descrição da atividade"
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => append({ titulo: '', descricao: '' })}
              >
                Adicionar atividade
              </Button>
      </div>
    </FormItem>
  )}
      />

      <FormField
        control={form.control}
        name="orcamento_previsto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Orçamento previsto *</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Valor previsto" {...field} />
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
            <FormLabel>Orçamento gasto</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Valor gasto" {...field} />
            </FormControl>
            <FormDescription>
              Esse valor pode ser alterado no decorrer do projeto
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      {isCompany && (
        <>
          <FormField
            control={form.control}
            name="responsavel_principal_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável principal do projeto</FormLabel>
                <Select
                  disabled={!data || data.length === 0 || isPending}
                  onValueChange={(e) => {
                    field.onChange(e);
                    const selectedUser = data?.find((user) => user.id === e);
                    if (selectedUser) {
                      setPrimaryResponsible({
                        cpf: selectedUser.cpf,
                      });
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável principal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.nome_completo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>CPF do responsável principal</FormLabel>
            <FormControl>
              <Input
                value={primaryResponsible.cpf}
                readOnly
                disabled
                placeholder="CPF do responsável principal"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </>
      )}

      <FormField
        control={form.control}
        name="equipe"
        render={() => (
          <FormItem>
            <FormLabel>Equipe de trabalho</FormLabel>
            <div className="space-y-4 max-h-[450px] overflow-y-auto  pb-4">
              {equipeFields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 items-start border p-4 rounded-md"
                >
                  <h5>Integrante {index + 1}</h5>
                  <FormField
                    control={form.control}
                    name={`equipe.${index}.nome`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor={`equipe.${index}.nome`}>
                          Nome
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            id={`equipe.${index}.nome`}
                            {...field}
                            placeholder="Nome do integrante"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`equipe.${index}.funcao`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor={`equipe.${index}.funcao`}>
                          Função
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            id={`equipe.${index}.funcao`}
                            {...field}
                            placeholder="Função do integrante"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`equipe.${index}.cpf_cnpj`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor={`equipe.${index}.cpf_cnpj`}>
                          CPF/CNPJ
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            id={`equipe.${index}.cpf_cnpj`}
                            {...field}
                            placeholder="000.000.000-00 ou 00.000.000/0000-00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={() => removeEquipe(index)}
                  >
                    Remover integrante
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              className="mt-4"
              disabled={isPending}
              size="sm"
              onClick={() =>
                appendEquipe({ nome: '', funcao: '', cpf_cnpj: '' })
              }
            >
              Adicionar integrante
            </Button>
          </FormItem>
        )}
      />
    </div>
  );

  const steps = isCompany
    ? [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6]
    : [renderStep1, renderStep2, renderStep4, renderStep5, renderStep6];

  const renderSteps = () => (
    <>
      {steps.map((StepComponent, index) => (
        <div key={index} className={currentStep === index + 1 ? '' : 'hidden'}>
          {StepComponent()}
        </div>
      ))}
    </>
  );

  return (
    <div className="max-w-2xl mx-auto px-2 flex flex-col flex-1 overflow-y-auto">
      <div className="mb-6 border-b">
        <div className="flex items-center justify-center w-full mb-1 relative">
          <ChevronLeft className="h-5 w-5 text-gray-600 absolute left-0" />
          <h1 className="text-xl font-semibold ml-2 text-center">
            Cadastrar projeto
          </h1>
        </div>

        <p className="text-sm text-gray-600 text-center mb-2">
          {(() => {
            const name = form.getValues('nome');
            if (isCompany) {
              switch (currentStep) {
                case 1:
                  return 'Informações iniciais.';
                case 2:
                  return `Canva digital - ${name}`;
                case 3:
                case 4:
                  return `Dados do proponente - ${name}`;
                case 5:
                  return `Plano de trabalho - ${name}`;
                default:
                  return `Equipe de trabalho - ${name}`;
              }
            } else {
              switch (currentStep) {
                case 1:
                  return 'Informações iniciais.';
                case 2:
                  return `Canva digital - ${name}`;
                case 3:
                  return `Dados do proponente - ${name}`;
                case 4:
                  return `Plano de trabalho - ${name}`;
                default:
                  return `Equipe de trabalho - ${name}`;
              }
            }
          })()}
        </p>
      </div>

      {renderStepIndicator()}

      <div className="relative flex-1 overflow-y-auto">
        <div
          className="
      absolute top-0 left-0 right-0 h-4 
      pointer-events-none 
      bg-gradient-to-b from-white to-transparent z-10
    "
        />
        <div
          className="
      absolute bottom-0 left-0 right-0 h-4 
      pointer-events-none 
      bg-gradient-to-t from-white to-transparent z-10
    "
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-y-auto max-h-full px-2 pb-5"
          >
            {renderSteps()}

            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isPending}
              >
                Voltar
              </Button>

              {currentStep === totalSteps ? (
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  Finalizar
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid || isPending}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isPending && (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  )}
                  {currentStep < totalSteps ? (
                    <span className="">Avançar</span>
                  ) : (
                    <span className="">Finalizar</span>
                  )}

                  {!isPending && currentStep < totalSteps ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : null}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
