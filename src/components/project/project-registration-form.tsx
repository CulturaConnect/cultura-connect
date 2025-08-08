'use client';

import { useEffect, useState, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z, ZodSchema } from 'zod';
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
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { CurrencyInput } from '../ui/currency-input';
import { CanvasDrawer } from './canvas-drawer';

const modeloSchema = z.object({
  missao: z
    .string()
    .min(1, 'Informe a missão do projeto — esse campo é obrigatório.'),
  visao: z
    .string()
    .min(1, 'Descreva a visão de futuro do projeto. Campo obrigatório.'),
  mercado: z
    .string()
    .min(1, 'Informe o mercado em que o projeto está inserido.'),
  publico_alvo: z.string().min(1, 'Descreva o público-alvo do projeto.'),
  receita: z.string().min(1, 'Explique como o projeto gera receita.'),
  proposta_valor: z.string().min(1, 'Detalhe a proposta de valor do projeto.'),
  retencao: z
    .string()
    .min(1, 'Descreva como o projeto pretende reter o público.'),
});

const areaExecucaoSchema = z.object({
  rua: z.string().min(1, 'Rua é obrigatória'),
  cep: z.string().min(8, 'CEP deve ter pelo menos 8 dígitos'),
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  observacoes: z.string({
    required_error: 'O campo de observações é obrigatório.',
  }),
});

const cronogramaSchema = z
  .object({
    titulo: z.string().min(1, 'Título é obrigatório'),
    descricao: z.string().min(1, 'Descrição é obrigatória'),
    status: z.string().min(1, 'Status é obrigatório'),
    inicio: z.string().min(1, 'Data de início é obrigatória'),
    fim: z.string().min(1, 'Data de fim é obrigatória'),
  })
  .refine((data) => new Date(data.fim) >= new Date(data.inicio), {
    message: 'Data de término deve ser igual ou posterior à de início',
    path: ['fim'],
  });

const equipeSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  funcao: z.string().min(1, 'Função é obrigatória'),
  cpf_cnpj: z.string().min(11, 'CPF/CNPJ inválido'),
});

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

  const MAX_FILE_SIZE_MB = 10;
  const ACCEPTED_IMAGE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/svg+xml',
  ];

  const rawSchema = z.object({
    nome: z
      .string({ required_error: 'O nome do projeto é obrigatório.' })
      .min(2, 'O nome do projeto precisa ter no mínimo 2 caracteres.'),

    segmento: z
      .string({ required_error: 'Por favor, selecione um segmento.' })
      .min(1, 'Por favor, selecione um segmento.'),

    inicio: z
      .string({ required_error: 'A data de início é obrigatória.' })
      .min(1, 'A data de início é obrigatória.'),

    fim: z
      .string({ required_error: 'A data final é obrigatória.' })
      .min(1, 'A data final é obrigatória.'),

    is_public: z.boolean().default(true),

    imagem: z
      .instanceof(File, {
        message: 'É necessário enviar uma imagem para o projeto.',
      })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
        `O arquivo da imagem deve ser menor que ${MAX_FILE_SIZE_MB}MB.`,
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        'Formato de imagem inválido. Use PNG, JPG, JPEG ou SVG.',
      )
      .optional(),

    modelo: modeloSchema,

    titulo_oficial: z
      .string({ required_error: 'O título oficial do projeto é obrigatório.' })
      .min(2, 'O título oficial precisa ter no mínimo 2 caracteres.'),

    areas_execucao: z
      .array(areaExecucaoSchema)
      .min(1, 'É necessário adicionar pelo menos uma área de execução.'),

    resumo: z.string({ required_error: 'O resumo do projeto é obrigatório.' }),
    apresentacao: z.string({
      required_error: 'O campo de apresentação é obrigatório.',
    }),
    historico: z.string({
      required_error: 'O campo de histórico é obrigatório.',
    }),

    descricao_proposta: z.string({
      required_error: 'O campo de descrição da proposta é obrigatório.',
    }),
    descricao_contrapartida: z.string({
      required_error: 'O campo de descrição da contrapartida é obrigatório.',
    }),
    justificativa: z.string({
      required_error: 'O campo de justificativa é obrigatório.',
    }),
    objetivos_gerais: z.string({
      required_error: 'O campo Objetivos Gerais e específicos é obrigatório.',
    }),
    metas: z.string({ required_error: 'O campo de metas é obrigatório.' }),

    cronograma_atividades: z
      .array(cronogramaSchema)
      .min(1, 'É necessário adicionar pelo menos uma atividade ao cronograma.'),

    anexos: z
      .array(
        z.object({
          descricao: z.string({
            required_error: 'A descrição do anexo é obrigatória.',
          }),
          arquivo: z.instanceof(File, {
            message: 'É necessário selecionar um arquivo.',
          }),
        }),
      )
      .min(1, 'É necessário adicionar pelo menos um anexo.'),

    orcamento_previsto: z.string().optional(),

    orcamento_gasto: z.string().optional(),

    // IDs de responsáveis agora são opcionais
    responsavel_principal_id: z.string().optional(),
    responsavel_legal_id: z.string().optional(),

    equipe: z.array(equipeSchema).optional(),
  });

  const step1Schema = rawSchema
    .pick({
      nome: true,
      segmento: true,
      inicio: true,
      fim: true,
      is_public: true,
    })
    .refine((data) => new Date(data.fim) >= new Date(data.inicio), {
      message: 'A data final não pode ser anterior à data de início.',
      path: ['fim'],
    });

  const baseSchema = rawSchema.refine(
    (data) => new Date(data.fim) >= new Date(data.inicio),
    {
      message: 'Data de término deve igual ou posterior à de início',
      path: ['fim'],
    },
  );

  type FormData = z.infer<typeof baseSchema>;

  const [currentStep, setCurrentStep] = useState(1);
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
      is_public: true,
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
          observacoes: '',
        },
      ],
      resumo: '',
      apresentacao: '',
      historico: '',
      descricao_proposta: '',
      descricao_contrapartida: '',
      justificativa: '',
      objetivos_gerais: '',
      metas: '',
      orcamento_previsto: '',
      orcamento_gasto: '',
      cronograma_atividades: [
        {
          titulo: '',
          descricao: '',
          status: '',
          inicio: '',
          fim: '',
        },
      ],
      anexos: [
        {
          descricao: '',

          arquivo: undefined as unknown as File,
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

  console.log(form.formState.errors);

  const imageFile = form.watch('imagem');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { control } = form;

  const navigate = useNavigate();

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
    fields: anexosFields,
    append: appendAnexo,
    remove: removeAnexo,
  } = useFieldArray({
    control,
    name: 'anexos',
  });

  async function handleCepBlur(index: number, value: string) {
    const cep = value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.erro) return;
      form.setValue(
        `areas_execucao.${index}.logradouro`,
        data.logradouro || '',
        {
          shouldValidate: true,
        },
      );
      form.setValue(`areas_execucao.${index}.bairro`, data.bairro || '', {
        shouldValidate: true,
      });
      form.setValue(`areas_execucao.${index}.cidade`, data.localidade || '', {
        shouldValidate: true,
      });
      form.setValue(`areas_execucao.${index}.rua`, data.logradouro || '', {
        shouldValidate: true,
      });
      form.setValue(
        `areas_execucao.${index}.complemento`,
        data.complemento || '',
        { shouldValidate: true },
      );
    } catch {
      toast.error('Erro ao buscar CEP. Verifique o número e tente novamente.');
    }
  }

  const {
    fields: equipeFields,
    append: appendEquipe,
    remove: removeEquipe,
  } = useFieldArray({
    control,
    name: 'equipe',
  });

  const stepSchema: Record<number, ZodSchema> = isCompany
    ? {
        1: step1Schema,
        2: rawSchema.pick({ modelo: true }),
        3: rawSchema.pick({ responsavel_legal_id: true }),
        4: rawSchema.pick({
          titulo_oficial: true,
          areas_execucao: true,
          resumo: true,
          apresentacao: true,
          historico: true,
        }),
        5: rawSchema.pick({
          descricao_proposta: true,
          descricao_contrapartida: true,
          justificativa: true,
          objetivos_gerais: true,
          metas: true,
          cronograma_atividades: true,
          orcamento_previsto: true,
          orcamento_gasto: true,
        }),
        6: rawSchema.pick({ responsavel_principal_id: true, equipe: true }),
        7: rawSchema.pick({ anexos: true }),
      }
    : {
        1: step1Schema,
        2: rawSchema.pick({ modelo: true }),
        3: rawSchema.pick({
          titulo_oficial: true,
          areas_execucao: true,
          resumo: true,
          apresentacao: true,
          historico: true,
        }),
        4: rawSchema.pick({
          descricao_proposta: true,
          descricao_contrapartida: true,
          justificativa: true,
          objetivos_gerais: true,
          metas: true,
          cronograma_atividades: true,
          orcamento_previsto: true,
          orcamento_gasto: true,
        }),
        5: rawSchema.pick({ equipe: true }),
        6: rawSchema.pick({ anexos: true }),
      };

  const { mutateAsync, isPending } = useCreateProjectMutation();

  const onSubmit = async (values: FormData) => {
    try {
      const res = await mutateAsync({
        ...values,
        company_id: user?.id,
        cronograma_atividades: values.cronograma_atividades.map((activity) => ({
          ...activity,
          acompanhamento: '',
          evidencias: [],
        })),

        orcamento_previsto: Number(values.orcamento_previsto) || 0,
        orcamento_gasto: values.orcamento_gasto
          ? Number(values.orcamento_gasto)
          : undefined,
      });

      if (res) {
        navigate('/', { replace: true });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Erro ao criar projeto.');
    }
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

  const totalSteps = isCompany ? 7 : 6;

  const nextStep = async () => {
    const values = form.getValues();

    try {
      await stepSchema[currentStep].parseAsync(values);
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors = err.errors.map((e) => {
          return `• ${e.message}`;
        });

        const errorMessage = formattedErrors.join('\n');

        toast.error('Erros na validação:', {
          description: (
            <div className="text-sm whitespace-pre-wrap">{errorMessage}</div>
          ),
          duration: 5000,
          dismissible: true,
          position: 'top-right',
        });
      } else {
        toast.error('Erro inesperado na validação.');
        console.error(err);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex flex-wrap justify-center gap-4 mb-4">
      {Array.from({ length: totalSteps }, (_, idx) => idx + 1).map(
        (step, index) => (
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
            {index < totalSteps - 1 && (
              <div
                className={`hidden sm:block w-12 h-0.5 transition-colors duration-200 ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ),
      )}
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

      <FormField
        control={form.control}
        name="is_public"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Visibilidade</FormLabel>
            <Select
              onValueChange={(v) => field.onChange(v === 'public')}
              defaultValue={field.value ? 'public' : 'private'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="public">Público</SelectItem>
                <SelectItem value="private">Privado</SelectItem>
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
                <Input
                  type="date"
                  {...field}
                  onChange={(e) => {
                    const endDate = form.getValues('fim');
                    if (new Date(e.target.value) > new Date(endDate)) {
                      toast.error(
                        'A data de início não pode ser posterior à data de fim.',
                        { duration: 3000, position: 'top-right' },
                      );
                      return;
                    } else {
                      field.onChange(e);
                      form.clearErrors('inicio');
                      form.clearErrors('fim');
                    }
                  }}
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
              <FormLabel>Fim</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  onChange={(e) => {
                    const startDate = form.getValues('inicio');
                    if (new Date(e.target.value) < new Date(startDate)) {
                      toast.error(
                        'A data de fim não pode ser anterior à data de início.',
                        { duration: 3000, position: 'top-right' },
                      );

                      return;
                    } else {
                      field.onChange(e);

                      form.clearErrors('inicio');
                      form.clearErrors('fim');
                    }
                  }}
                />
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
          {modelCards.map((model) => {
            const Icon = model.icon;

            return (
              <CanvasDrawer
                key={model.id}
                model={{
                  id: model.id,
                  title: model.title,
                  description: model.description,
                  area: model.area,
                  color: model.color,
                }}
                icon={Icon}
              />
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

      <FormField
        control={form.control}
        name="apresentacao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apresentação</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva a apresentação..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="historico"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Histórico</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva o histórico..."
                className="min-h-[100px]"
                {...field}
              />
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
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="descricao_proposta"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição da proposta</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva a proposta..."
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
        name="descricao_contrapartida"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição da contrapartida</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva a contrapartida..."
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
        name="justificativa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Justificativa</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Justificativa do projeto..."
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
        name="objetivos_gerais"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objetivos Gerais e específicos</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva os objetivos gerais e específicos..."
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
        name="orcamento_previsto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Orçamento previsto *</FormLabel>
            <FormControl>
              <CurrencyInput
                value={field.value}
                onValueChange={(value) => field.onChange(value ?? '')}
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
            <FormLabel>Orçamento gasto</FormLabel>
            <FormControl>
              <CurrencyInput
                value={field.value}
                onValueChange={(value) => field.onChange(value ?? '')}
                onBlur={field.onBlur}
                name={field.name}
                placeholder="R$ 0,00"
              />
            </FormControl>
            <FormDescription>
              Esse valor pode ser alterado no decorrer do projeto
            </FormDescription>
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

                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name={`cronograma_atividades.${index}.status`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="novo">Novo</SelectItem>
                              <SelectItem value="andamento">
                                Em Andamento
                              </SelectItem>
                              <SelectItem value="pendente">Pendente</SelectItem>
                              <SelectItem value="atrasado">Atrasado</SelectItem>
                              <SelectItem value="concluido">
                                Concluído
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <FormField
                      control={form.control}
                      name={`cronograma_atividades.${index}.inicio`}
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
                      name={`cronograma_atividades.${index}.fim`}
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
                onClick={() =>
                  append({
                    titulo: '',
                    descricao: '',
                    status: '',
                    inicio: '',
                    fim: '',
                  })
                }
              >
                Adicionar atividade
              </Button>
            </div>
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
          </FormItem>
        </>
      )}

      <FormField
        control={form.control}
        name="equipe"
        render={() => (
          <FormItem>
            <FormLabel>Equipe de trabalho</FormLabel>
            <div className="space-y-4 max-h-[550px] overflow-y-auto  pb-4">
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

  const renderStep7 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="anexos"
        render={() => (
          <FormItem>
            <FormLabel>Anexos</FormLabel>
            <div className="space-y-4">
              {anexosFields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 items-start border p-4 rounded-md"
                >
                  <h5>Anexo {index + 1}</h5>
                  <FormField
                    control={form.control}
                    name={`anexos.${index}.descricao`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o anexo..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`anexos.${index}.arquivo`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Arquivo</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {anexosFields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAnexo(index)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendAnexo({
                    descricao: '',

                    arquivo: undefined as unknown as File,
                  })
                }
              >
                Adicionar anexo
              </Button>
            </div>
          </FormItem>
        )}
      />
    </div>
  );

  const steps = isCompany
    ? [
        renderStep1,
        renderStep2,
        renderStep3,
        renderStep4,
        renderStep5,
        renderStep6,
        renderStep7,
      ]
    : [
        renderStep1,
        renderStep2,
        renderStep4,
        renderStep5,
        renderStep6,
        renderStep7,
      ];

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
          <ChevronLeft
            onClick={() => navigate(-1)}
            className="h-5 w-5 text-gray-600 absolute left-0"
          />
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
                  return `Dados do proponente - ${name}`;
                case 4:
                  return `Dados do proponente - ${name}`;
                case 5:
                  return `Plano de trabalho - ${name}`;
                case 6:
                  return `Equipe de trabalho - ${name}`;
                default:
                  return `Anexos - ${name}`;
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
                case 5:
                  return `Equipe de trabalho - ${name}`;
                default:
                  return `Anexos - ${name}`;
              }
            }
          })()}
        </p>
      </div>

      {renderStepIndicator()}

      <div className="relative flex-1 overflow-y-auto">
        {/* <div
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
        /> */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-y-auto px-2 pb-5"
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
                <Button
                  disabled={isPending}
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isPending && (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  )}
                  Finalizar
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isPending}
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
