# 📚 Documentação Técnica - Cultura Connect

> 🎨 **Plataforma para Gestão de Projetos Culturais**  
> Uma aplicação React moderna para conectar artistas, produtores e patrocinadores no ecossistema cultural brasileiro.

---

## 📋 Índice

- [🏗️ Arquitetura do Sistema](#️-arquitetura-do-sistema)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🚀 Configuração e Instalação](#-configuração-e-instalação)
- [🔐 Sistema de Autenticação](#-sistema-de-autenticação)
- [📱 Componentes e UI](#-componentes-e-ui)
- [🌐 Gerenciamento de Estado](#-gerenciamento-de-estado)
- [📡 Integração com API](#-integração-com-api)
- [🎯 Funcionalidades Principais](#-funcionalidades-principais)
- [🧪 Testes](#-testes)
- [🚀 Deploy e Build](#-deploy-e-build)
- [📖 Guias de Desenvolvimento](#-guias-de-desenvolvimento)

---

## 🏗️ Arquitetura do Sistema

### 🎯 **Visão Geral**

O **Cultura Connect** é uma Single Page Application (SPA) construída com React 18 e TypeScript, seguindo uma arquitetura modular e escalável:

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 Frontend (React)                      │
├─────────────────────────────────────────────────────────────┤
│  📱 UI Components  │  🔄 State Management  │  🛡️ Auth       │
│  (Shadcn/UI)      │  (TanStack Query)     │  (Context)     │
├─────────────────────────────────────────────────────────────┤
│                    🔌 API Layer (Axios)                     │
├─────────────────────────────────────────────────────────────┤
│                    🖥️ Backend API                           │
└─────────────────────────────────────────────────────────────┘
```

### 🏛️ **Padrões Arquiteturais**

- **📦 Component-Based Architecture**: Componentes reutilizáveis e modulares
- **🔄 Unidirectional Data Flow**: Fluxo de dados previsível
- **🎯 Feature-Based Organization**: Organização por funcionalidades
- **🛡️ Authentication-First**: Segurança integrada desde o design

---

## 🛠️ Stack Tecnológica

### 🎨 **Frontend Core**

| Tecnologia | Versão | Descrição |
|------------|--------|----------|
| ⚛️ **React** | `^18.3.1` | Biblioteca principal para UI |
| 📘 **TypeScript** | `^5.5.3` | Tipagem estática |
| ⚡ **Vite** | `latest` | Build tool e dev server |
| 🎨 **Tailwind CSS** | `^3.4.11` | Framework CSS utilitário |

### 🧩 **UI & Componentes**

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| 🎭 **Shadcn/UI** | `latest` | Sistema de design |
| 🔘 **Radix UI** | `^1.x` | Componentes primitivos |
| 🎨 **Lucide React** | `^0.462.0` | Ícones |
| 🌈 **Class Variance Authority** | `^0.7.1` | Variantes de componentes |

### 🔄 **Estado e Dados**

| Ferramenta | Versão | Finalidade |
|------------|--------|------------|
| 🔄 **TanStack Query** | `^5.56.2` | Cache e sincronização de dados |
| 🌐 **Axios** | `^1.9.0` | Cliente HTTP |
| 📝 **React Hook Form** | `^7.53.0` | Gerenciamento de formulários |
| ✅ **Zod** | `^3.23.8` | Validação de schemas |

### 🧭 **Navegação e Roteamento**

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| 🧭 **React Router DOM** | `^6.26.2` | Roteamento SPA |

### 🧪 **Testes**

| Ferramenta | Versão | Tipo |
|------------|--------|------|
| 🧪 **Vitest** | `latest` | Test runner |
| 🎭 **Testing Library** | `^16.3.0` | Testes de componentes |
| 🃏 **Jest DOM** | `^6.6.3` | Matchers customizados |

---

## 📁 Estrutura do Projeto

```
cultura-connect/
├── 📁 public/                    # Assets estáticos
│   ├── 🖼️ Logo.svg              # Logo da aplicação
│   ├── 🖼️ placeholder.svg       # Imagens placeholder
│   └── 🤖 robots.txt            # SEO
│
├── 📁 src/                       # Código fonte
│   ├── 📁 api/                   # 🔌 Camada de API
│   │   ├── 📁 auth/              # Autenticação
│   │   ├── 📁 companies/         # Empresas
│   │   ├── 📁 projects/          # Projetos
│   │   ├── 📁 users/             # Usuários
│   │   └── 📁 notifications/     # Notificações
│   │
│   ├── 📁 components/            # 🧩 Componentes React
│   │   ├── 📁 auth/              # Componentes de autenticação
│   │   ├── 📁 layout/            # Layout e navegação
│   │   ├── 📁 project/           # Componentes de projetos
│   │   ├── 📁 tour/              # Tour guiado
│   │   └── 📁 ui/                # Componentes UI base
│   │
│   ├── 📁 contexts/              # 🔄 Contextos React
│   │   └── 🔐 auth.tsx           # Contexto de autenticação
│   │
│   ├── 📁 hooks/                 # 🪝 Custom hooks
│   │   ├── 📱 use-mobile.tsx     # Hook para detecção mobile
│   │   └── 🍞 use-toast.ts       # Hook para toasts
│   │
│   ├── 📁 lib/                   # 🛠️ Utilitários
│   │   ├── 🌐 api.ts             # Configuração Axios
│   │   └── 🔧 utils.ts           # Funções utilitárias
│   │
│   ├── 📁 pages/                 # 📄 Páginas da aplicação
│   │   ├── 🏠 Index.tsx          # Página inicial
│   │   ├── 🔐 login.tsx          # Login
│   │   ├── 📝 register-*.tsx     # Cadastros
│   │   ├── 👤 profile*.tsx       # Perfis
│   │   ├── 🎯 project-*.tsx      # Páginas de projetos
│   │   └── 👑 admin-dashboard.tsx # Dashboard admin
│   │
│   ├── 📁 services/              # 🔧 Serviços
│   │   └── 🔐 auth.ts            # Serviços de autenticação
│   │
│   ├── 📁 utils/                 # 🛠️ Utilitários específicos
│   │   ├── 🔐 auth.ts            # Utilitários de auth
│   │   ├── 📅 date.ts            # Formatação de datas
│   │   ├── 🔧 helpers.ts         # Funções auxiliares
│   │   └── ✅ validation.ts      # Validações
│   │
│   ├── 🎨 App.tsx                # Componente raiz
│   ├── 🚀 main.tsx               # Entry point
│   └── 🎨 index.css              # Estilos globais
│
├── 📁 __tests__/                 # 🧪 Testes
├── ⚙️ vite.config.ts             # Configuração Vite
├── 🎨 tailwind.config.ts         # Configuração Tailwind
├── 📘 tsconfig.json              # Configuração TypeScript
├── 📦 package.json               # Dependências
└── 📖 README.md                  # Documentação básica
```

---

## 🚀 Configuração e Instalação

### 📋 **Pré-requisitos**

- 📦 **Node.js** >= 18.0.0
- 📦 **npm** >= 8.0.0 ou **yarn** >= 1.22.0
- 🌐 **Git** para controle de versão

### 🛠️ **Instalação**

```bash
# 1️⃣ Clone o repositório
git clone <repository-url>
cd cultura-connect

# 2️⃣ Instale as dependências
npm install
# ou
yarn install

# 3️⃣ Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações

# 4️⃣ Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

### 🌍 **Variáveis de Ambiente**

```env
# 🔌 API Configuration
VITE_API_URL=http://localhost:3000/api

# 🔐 Authentication
VITE_JWT_SECRET=your-jwt-secret

# 🌐 App Configuration
VITE_APP_NAME="Cultura Connect"
VITE_APP_VERSION="1.0.0"
```

### 🚀 **Scripts Disponíveis**

```bash
# 🔥 Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# 🏗️ Build
npm run build        # Build para produção
npm run build:dev    # Build para desenvolvimento

# 👀 Preview
npm run preview      # Preview do build

# 🧪 Testes
npm run test         # Executa testes
npm run test:watch   # Testes em modo watch

# 🔍 Linting
npm run lint         # Executa ESLint
```

---

## 🔐 Sistema de Autenticação

### 🏗️ **Arquitetura de Auth**

```typescript
// 🔄 Fluxo de Autenticação
Usuário → Login → JWT Token → Context → Protected Routes
```

### 🧩 **Componentes Principais**

#### 🔐 **AuthContext**
```typescript
// src/contexts/auth.tsx
interface AuthContextData {
  signed: boolean;           // Status de autenticação
  user: AuthUser | null;     // Dados do usuário
  Login(user: object): Promise<void>;
  Logout(): void;
  forgotPasswordSend(email: string): Promise<boolean>;
  updateUser(userData: AuthUser): void;
}
```

#### 👤 **Tipos de Usuário**
```typescript
interface AuthUser {
  id: string;
  tipo: 'pessoa' | 'empresa';  // Tipo de usuário
  email: string;
  nome: string;
  telefone: string;
  // Campos específicos para empresas
  cnpj?: string;
  isMei?: boolean;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  // Campos específicos para pessoas
  cpf?: string;
  imagemUrl?: string;
}
```

### 🛡️ **Proteção de Rotas**

#### 🔒 **PrivateRoute**
```typescript
// Protege rotas que requerem autenticação
<PrivateRoute>
  <ComponenteProtegido />
</PrivateRoute>
```

#### 👑 **AdminRoute**
```typescript
// Protege rotas administrativas
<AdminRoute>
  <AdminDashboard />
</AdminRoute>
```

### 🔑 **Gerenciamento de Tokens**

```typescript
// src/utils/auth.ts

// 💾 Armazenamento seguro
setToken(token: string): void
getToken(): string | null
removeToken(): void

// ⏰ Validação de expiração
isTokenExpired(token: string): boolean

// 🔄 Interceptadores automáticos
api.interceptors.request.use(/* adiciona token */)
api.interceptors.response.use(/* trata 401 */)
```

---

## 📱 Componentes e UI

### 🎨 **Sistema de Design**

O projeto utiliza **Shadcn/UI** como base, construído sobre **Radix UI** e **Tailwind CSS**:

```typescript
// 🎨 Configuração do tema
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      // ... mais cores
    }
  }
}
```

### 🧩 **Componentes UI Disponíveis**

#### 📋 **Formulários**
- ✅ `Button` - Botões com variantes
- 📝 `Input` - Campos de entrada
- 📄 `Textarea` - Área de texto
- 🔽 `Select` - Seleção dropdown
- ☑️ `Checkbox` - Caixas de seleção
- 🔘 `RadioGroup` - Grupos de radio
- 🎚️ `Switch` - Interruptores
- 💰 `CurrencyInput` - Entrada de moeda

#### 📦 **Layout**
- 🃏 `Card` - Cartões de conteúdo
- 📑 `Tabs` - Abas de navegação
- 🎭 `Dialog` - Modais
- 📱 `Drawer` - Gavetas mobile
- 🔄 `Accordion` - Acordeões
- 📊 `Progress` - Barras de progresso

#### 🎯 **Navegação**
- 🧭 `NavigationMenu` - Menu principal
- 📱 `BottomNavigation` - Navegação inferior
- 🍞 `Breadcrumb` - Migalhas de pão
- 📄 `Pagination` - Paginação

#### 💬 **Feedback**
- 🍞 `Toast` - Notificações
- ⚠️ `Alert` - Alertas
- 🔄 `Spinner` - Loading states
- 💀 `Skeleton` - Placeholders

### 🎨 **Componentes Customizados**

#### 🎯 **ProjectCard**
```typescript
// src/components/project/project-card.tsx
interface ProjectCardProps {
  project: Project;
  onView?: () => void;
  onEdit?: () => void;
}
```

#### 📱 **BottomNavigation**
```typescript
// src/components/layout/bottom-navigation.tsx
// Navegação otimizada para mobile
```

#### 🎪 **NewUserTour**
```typescript
// src/components/tour/NewUserTour.tsx
// Tour guiado para novos usuários usando react-joyride
```

---

## 🌐 Gerenciamento de Estado

### 🔄 **TanStack Query (React Query)**

Utilizado para gerenciamento de estado do servidor:

```typescript
// 📡 Configuração global
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
    },
  },
});
```

#### 🔍 **Queries (Leitura)**
```typescript
// src/api/projects/projects.queries.ts

// 📋 Listar projetos
export const useGetProjectsQuery = (filters?: ProjectFilters) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => getProjects(filters),
  });
};

// 👁️ Projeto específico
export const useGetProjectByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
};
```

#### ✏️ **Mutations (Escrita)**
```typescript
// ➕ Criar projeto
export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      toast.success('Projeto criado com sucesso!');
    },
  });
};

// ✏️ Atualizar projeto
export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectData }) => 
      updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['project', id]);
      queryClient.invalidateQueries(['projects']);
    },
  });
};
```

### 🏪 **Estado Local**

#### 🔐 **AuthContext**
```typescript
// Estado global de autenticação
const { user, signed, Login, Logout } = useAuth();
```

#### 📝 **React Hook Form**
```typescript
// Gerenciamento de formulários
const form = useForm<ProjectFormData>({
  resolver: zodResolver(projectSchema),
  defaultValues: {
    title: '',
    description: '',
    // ...
  },
});
```

---

## 📡 Integração com API

### 🔌 **Configuração Base**

```typescript
// src/lib/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Interceptador de requisições
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🚨 Interceptador de respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout automático em caso de token inválido
      removeToken();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

### 🗂️ **Organização por Módulos**

#### 🔐 **Auth Module**
```typescript
// src/api/auth/
├── auth.service.ts    # Serviços de API
├── auth.queries.ts    # React Query hooks
└── types.ts          # Tipos TypeScript
```

#### 🎯 **Projects Module**
```typescript
// src/api/projects/projects.service.ts

// 📋 Listar projetos
export const getProjects = async (filters?: ProjectFilters): Promise<Project[]> => {
  const { data } = await api.get('/projects', { params: filters });
  return data;
};

// 👁️ Buscar projeto por ID
export const getProjectById = async (id: string): Promise<Project> => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

// ➕ Criar projeto
export const createProject = async (projectData: CreateProjectData): Promise<Project> => {
  const { data } = await api.post('/projects', projectData);
  return data;
};

// ✏️ Atualizar projeto
export const updateProject = async (id: string, projectData: UpdateProjectData): Promise<Project> => {
  const { data } = await api.put(`/projects/${id}`, projectData);
  return data;
};

// 🗑️ Deletar projeto
export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
```

### 📊 **Tipos TypeScript**

```typescript
// src/api/projects/types.ts

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  startDate: string;
  endDate: string;
  location?: string;
  isDigital: boolean;
  company_id: string;
  members: ProjectMember[];
  activities: ProjectActivity[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'novo' | 'andamento' | 'pendente' | 'atrasado' | 'concluido';

export interface ProjectMember {
  id: string;
  nome: string;
  funcao: string;
  cpf_cnpj: string;
}

export interface ProjectActivity {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  start: string;
  end: string;
  acompanhamento: string;
}
```

---

## 🎯 Funcionalidades Principais

### 🔐 **Autenticação e Autorização**

#### 📝 **Cadastro Multi-tipo**
- 👤 **Pessoa Física**: CPF, dados pessoais
- 🏢 **Pessoa Jurídica**: CNPJ, inscrições, MEI
- ✅ **Validação**: CPF/CNPJ com biblioteca especializada

#### 🔑 **Login e Recuperação**
- 🔐 Login com email/senha
- 👁️ Toggle de visibilidade de senha
- 🔄 Recuperação de senha por email
- 🎯 Redirecionamento inteligente

### 🎯 **Gestão de Projetos**

#### ➕ **Criação de Projetos**
```typescript
// Formulário multi-etapas com validação
const projectSteps = [
  'informacoes-basicas',    // 📋 Informações básicas
  'localizacao',           // 📍 Localização
  'equipe',                // 👥 Equipe
  'orcamento',             // 💰 Orçamento
  'cronograma',            // 📅 Cronograma
  'anexos',                // 📎 Anexos
];
```

#### 📊 **Dashboard de Projetos**
- 🃏 **Grid de Cards**: Visualização em cartões
- 🔍 **Filtros**: Status, data, orçamento
- 📱 **Responsivo**: Otimizado para mobile
- 🎨 **Status Visual**: Badges coloridos por status

#### 📋 **Detalhes do Projeto**
- 📑 **Abas Organizadas**: Detalhes, Gerenciamento
- 👥 **Equipe**: Lista de membros com funções
- 📎 **Anexos**: Upload e visualização
- 🎯 **Localização**: Mapa ou indicação digital

### 📅 **Cronograma e Atividades**

#### 🎯 **Gestão de Atividades**
```typescript
// src/pages/project-activities.tsx

// 📊 Métricas do projeto
const metrics = {
  totalActivities: activities.length,
  completedActivities: completed.length,
  progressPercentage: (completed.length / activities.length) * 100,
  totalBudget: activities.reduce((sum, act) => sum + act.budget, 0),
};
```

#### ✅ **Status de Atividades**
- 🆕 **Novo**: Atividade criada
- 🔄 **Em Andamento**: Em execução
- ⏸️ **Pendente**: Aguardando ação
- 🚨 **Atrasado**: Prazo vencido
- ✅ **Concluído**: Finalizada

### 💰 **Gestão Orçamentária**

#### 📊 **Itens de Orçamento**
```typescript
// src/pages/project-budget.tsx

interface BudgetItem {
  id: string;
  description: string;    // Descrição do item
  quantity: number;       // Quantidade
  unit: string;          // Unidade (un, kg, m²)
  unitQty: number;       // Quantidade por unidade
  unitValue: number;     // Valor unitário
  adjustTotal: boolean;  // Ajuste automático
}
```

#### 💹 **Cálculos Automáticos**
- 🧮 **Total por Item**: `quantity × unitQty × unitValue`
- 📊 **Total Geral**: Soma de todos os itens
- 📈 **Progresso**: Percentual do orçamento utilizado
- 💱 **Formatação**: Valores em Real brasileiro

### 👤 **Perfis de Usuário**

#### 🏢 **Perfil Empresa**
- 📋 **Dados Corporativos**: CNPJ, inscrições
- 🏷️ **Indicador MEI**: Badge especial
- 📊 **Projetos**: Lista de projetos da empresa

#### 👤 **Perfil Pessoa**
- 📋 **Dados Pessoais**: CPF, telefone
- 🖼️ **Avatar**: Upload de imagem
- 🔐 **Segurança**: Alteração de senha

### 👑 **Dashboard Administrativo**

#### 📊 **Métricas Gerais**
- 📈 **Estatísticas**: Usuários, projetos, atividade
- 📊 **Gráficos**: Visualização de dados
- 🔍 **Filtros**: Período, status, tipo

---

## 🧪 Testes

### 🛠️ **Configuração de Testes**

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

### 🧪 **Tipos de Teste**

#### 🧩 **Testes de Componentes**
```typescript
// src/__tests__/admin-dashboard.test.tsx

import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminDashboard from '../pages/admin-dashboard';

describe('AdminDashboard', () => {
  it('should render admin dashboard', () => {
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <AdminDashboard />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

#### 🛡️ **Testes de Rotas**
```typescript
// src/__tests__/admin-route.test.tsx

// Testa proteção de rotas administrativas
describe('AdminRoute', () => {
  it('should redirect non-admin users', () => {
    // Test implementation
  });
});
```

### 🚀 **Executando Testes**

```bash
# 🧪 Executar todos os testes
npm run test

# 👀 Modo watch
npm run test:watch

# 📊 Coverage
npm run test:coverage

# 🎯 Teste específico
npm run test admin-dashboard
```

---

## 🚀 Deploy e Build

### 🏗️ **Build para Produção**

```bash
# 🏗️ Build otimizado
npm run build

# 📊 Análise do bundle
npm run build -- --analyze

# 👀 Preview local
npm run preview
```

### 📦 **Otimizações de Build**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
        },
      },
    },
  },
});
```

### 🌐 **Variáveis de Ambiente por Ambiente**

```bash
# 🔧 Desenvolvimento
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development

# 🧪 Staging
VITE_API_URL=https://staging-api.culturaconnect.com/api
VITE_ENV=staging

# 🚀 Produção
VITE_API_URL=https://api.culturaconnect.com/api
VITE_ENV=production
```

---

## 📖 Guias de Desenvolvimento

### 🎨 **Padrões de Código**

#### 📝 **Nomenclatura**
```typescript
// ✅ Componentes: PascalCase
const ProjectCard = () => {};

// ✅ Hooks: camelCase com 'use'
const useProjectData = () => {};

// ✅ Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// ✅ Arquivos: kebab-case
// project-card.tsx
// use-project-data.ts
```

#### 🏗️ **Estrutura de Componentes**
```typescript
// 📁 src/components/project/project-card.tsx

import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/api/projects/types';

interface ProjectCardProps {
  project: Project;
  onView?: () => void;
  onEdit?: () => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({ 
  project, 
  onView, 
  onEdit 
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Conteúdo do card */}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
```

### 🔧 **Utilitários e Helpers**

#### 📅 **Formatação de Datas**
```typescript
// src/utils/date.ts

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDateToPTBR = (date: string | Date): string => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

export const formatCurrencyToPTBR = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
```

#### 🔐 **Validações**
```typescript
// src/utils/validation.ts

import { cpf, cnpj } from 'cpf-cnpj-validator';

export const validateCPF = (cpfValue: string): boolean => {
  return cpf.isValid(cpfValue);
};

export const validateCNPJ = (cnpjValue: string): boolean => {
  return cnpj.isValid(cnpjValue);
};

export const censurarDocumento = (documento: string): string => {
  if (!documento) return '';
  
  if (documento.length === 11) {
    // CPF: 123.456.789-XX
    return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-XX');
  } else if (documento.length === 14) {
    // CNPJ: 12.345.678/0001-XX
    return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-XX');
  }
  
  return documento;
};
```

### 🎨 **Customização de Temas**

#### 🌈 **Cores Personalizadas**
```css
/* src/index.css */

@layer base {
  :root {
    /* 🎨 Cores primárias */
    --primary: 262 83% 58%;           /* Roxo vibrante */
    --primary-foreground: 210 40% 98%;
    
    /* 🎨 Cores secundárias */
    --secondary: 220 14% 96%;
    --secondary-foreground: 220 9% 46%;
    
    /* 🎨 Cores de status */
    --success: 142 76% 36%;           /* Verde */
    --warning: 38 92% 50%;            /* Amarelo */
    --error: 0 84% 60%;               /* Vermelho */
    
    /* 🎨 Sidebar */
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5% 26%;
  }
  
  .dark {
    /* 🌙 Modo escuro */
    --primary: 262 83% 58%;
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;
  }
}
```

### 📱 **Responsividade**

#### 📐 **Breakpoints Tailwind**
```typescript
// Breakpoints padrão do Tailwind
const breakpoints = {
  sm: '640px',   // 📱 Mobile grande
  md: '768px',   // 📱 Tablet
  lg: '1024px',  // 💻 Desktop pequeno
  xl: '1280px',  // 💻 Desktop
  '2xl': '1536px' // 🖥️ Desktop grande
};
```

#### 📱 **Hook para Mobile**
```typescript
// src/hooks/use-mobile.tsx

import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return isMobile;
};
```

### 🚀 **Performance**

#### ⚡ **Lazy Loading**
```typescript
// Carregamento lazy de páginas
const ProjectDetails = lazy(() => import('./pages/project-details'));
const AdminDashboard = lazy(() => import('./pages/admin-dashboard'));

// Uso com Suspense
<Suspense fallback={<div>Carregando...</div>}>
  <ProjectDetails />
</Suspense>
```

#### 🎯 **Memoização**
```typescript
// Memoização de componentes pesados
const ProjectCard = memo(({ project }: ProjectCardProps) => {
  return (
    <Card>
      {/* Conteúdo do card */}
    </Card>
  );
});

// Memoização de cálculos
const totalBudget = useMemo(() => {
  return activities.reduce((sum, activity) => sum + activity.budget, 0);
}, [activities]);
```

---

## 🔧 Troubleshooting

### ❗ **Problemas Comuns**

#### 🚨 **Erro de CORS**
```bash
# Problema: API bloqueando requisições do frontend
# Solução: Configurar CORS no backend ou usar proxy

# vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

#### 🔐 **Token Expirado**
```typescript
// Problema: Token JWT expirado
// Solução: Interceptador automático

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

#### 📱 **Problemas de Layout Mobile**
```css
/* Problema: Layout quebrado em mobile */
/* Solução: Classes responsivas */

.container {
  @apply px-4 sm:px-6 lg:px-8;
  @apply max-w-sm sm:max-w-md lg:max-w-4xl;
}
```

### 🛠️ **Ferramentas de Debug**

#### 🔍 **React Query Devtools**
```typescript
// Adicionar em desenvolvimento
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* App components */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

---

## 📚 Recursos Adicionais

### 📖 **Documentação das Bibliotecas**

- ⚛️ [React](https://react.dev/)
- 📘 [TypeScript](https://www.typescriptlang.org/)
- ⚡ [Vite](https://vitejs.dev/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🎭 [Shadcn/UI](https://ui.shadcn.com/)
- 🔄 [TanStack Query](https://tanstack.com/query/latest)
- 🧭 [React Router](https://reactrouter.com/)
- 📝 [React Hook Form](https://react-hook-form.com/)
- ✅ [Zod](https://zod.dev/)

### 🎓 **Guias de Estudo**

- 📚 [React Patterns](https://reactpatterns.com/)
- 🎨 [Tailwind Components](https://tailwindui.com/)
- 🔧 [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- 🧪 [Testing Library](https://testing-library.com/)

---

## 👥 **Contribuição**

### 🔄 **Fluxo de Desenvolvimento**

```bash
# 1️⃣ Criar branch para feature
git checkout -b feature/nova-funcionalidade

# 2️⃣ Desenvolver e testar
npm run test
npm run lint

# 3️⃣ Commit seguindo padrão
git commit -m "feat: adiciona nova funcionalidade"

# 4️⃣ Push e Pull Request
git push origin feature/nova-funcionalidade
```

### 📝 **Padrão de Commits**

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de build
```

<div align="center">

**🎨 Cultura Connect - Conectando Arte e Tecnologia 🎨**

*Desenvolvido com ❤️ pela equipe de desenvolvimento*

---

*Última atualização: Agosto 2025*

</div>