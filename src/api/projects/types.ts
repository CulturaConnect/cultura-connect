export interface CreateProject {
  nome?: string;
  segmento?: string;
  inicio?: string;
  fim?: string;
  modelo?: Modelo;
  titulo_oficial?: string;
  imagem?: File;
  areas_execucao?: AreasExecucao[];
  resumo?: string;
  objetivos_gerais?: string;
  metas?: string;
  cronograma_atividades?: CronogramaAtividade[];
  responsavel_principal_id?: string;
  equipe?: Equipe[];
  responsavel_legal_id?: string;
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
}

export interface Equipe {
  nome?: string;
  funcao?: string;
  cpf_cnpj?: string;
}
