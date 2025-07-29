export interface CreateProject {
  company_id?: string;
  nome?: string;
  segmento?: string;
  inicio?: string;
  fim?: string;
  modelo?: Modelo;
  titulo_oficial?: string;
  imagem?: File;
  areas_execucao?: AreasExecucao[];
  resumo?: string;
  apresentacao?: string;
  historico?: string;
  observacoes?: string;
  descricao_proposta?: string;
  descricao_contrapartida?: string;
  justificativa?: string;
  objetivos_gerais?: string;
  metas?: string;
  cronograma_atividades?: CronogramaAtividade[];
  anexos?: Anexo[];
  responsavel_principal_id?: string;
  equipe?: Equipe[];
  responsavel_legal_id?: string;
  orcamento_previsto?: number;
  orcamento_gasto?: number;
  is_public?: boolean;
}

export interface UpdateProject {
  cronograma_atividades?: CronogramaAtividade[];
  status?: string;
  orcamento_previsto?: number;
  orcamento_gasto?: number;
  is_public?: boolean;
}

export interface Modelo {
  missao?: string;
  visao?: string;
  mercado?: string;
  publico_alvo?: string;
  receita?: string;
  proposta_valor?: string;
  retencao?: string;
}

export interface AreasExecucao {
  rua?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
}

export interface CronogramaAtividade {
  titulo?: string;
  descricao?: string;
  acompanhamento?: string;
  status?: string;
  inicio?: string;
  fim?: string;
  evidencias?: string[];
}

export interface Equipe {
  nome?: string;
  funcao?: string;
  cpf_cnpj?: string;
}

export interface Anexo {
  descricao?: string;
  arquivo?: File;
}

export interface Project {
  id: string;
  nome: string;
  segmento: string;
  inicio: string;
  fim: string;
  modelo: Modelo;
  titulo_oficial: string;
  imagem_url: string;
  areas_execucao: AreasExecucao[];
  resumo: string;
  apresentacao: string;
  historico: string;
  observacoes: string;
  descricao_proposta: string;
  descricao_contrapartida: string;
  justificativa: string;
  objetivos_gerais: string;
  metas: string;
  cronograma_atividades: CronogramaAtividade[];
  anexos: Anexo[];
  responsavel_principal_id: string | null;
  equipe: Equipe[];
  responsavel_legal_id: string | null;
  company_id: string;
  status: string;
  orcamento_previsto: number;
  orcamento_gasto: number;
  is_public: boolean;
  created_at: string;
}
