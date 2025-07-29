import api from '@/lib/api';
import {
  CreateProject,
  Project,
  UpdateProject,
  CronogramaAtividade,
} from './types';
import { BudgetItem } from '@/pages/project-budget';

export async function createProject(data: CreateProject) {
  const formData = new FormData();

  formData.append('nome', data.nome);
  formData.append('segmento', data.segmento ?? '');
  formData.append('inicio', data.inicio);
  formData.append('fim', data.fim);
  if (data.company_id) {
    formData.append('company_id', data.company_id);
  }

  formData.append('modelo', JSON.stringify(data.modelo));
  formData.append('areas_execucao', JSON.stringify(data.areas_execucao));
  formData.append(
    'cronograma_atividades',
    JSON.stringify(data.cronograma_atividades),
  );
  formData.append('equipe', JSON.stringify(data.equipe));

  formData.append('titulo_oficial', data.titulo_oficial ?? '');
  formData.append('resumo', data.resumo ?? '');
  formData.append('apresentacao', data.apresentacao ?? '');
  formData.append('historico', data.historico ?? '');
  formData.append('observacoes', data.observacoes ?? '');
  formData.append('descricao_proposta', data.descricao_proposta ?? '');
  formData.append('descricao_contrapartida', data.descricao_contrapartida ?? '');
  formData.append('justificativa', data.justificativa ?? '');
  formData.append('objetivos_gerais', data.objetivos_gerais ?? '');
  formData.append('metas', data.metas ?? '');
  formData.append(
    'orcamento_previsto',
    data.orcamento_previsto !== undefined && data.orcamento_previsto !== null
      ? String(data.orcamento_previsto)
      : '',
  );
  formData.append(
    'orcamento_gasto',
    data.orcamento_gasto !== undefined && data.orcamento_gasto !== null
      ? String(data.orcamento_gasto)
      : '',
  );
  formData.append('is_public', String(data.is_public ?? true));
  if (data.responsavel_principal_id) {
    formData.append('responsavel_principal_id', data.responsavel_principal_id);
  }
  if (data.responsavel_legal_id) {
    formData.append('responsavel_legal_id', data.responsavel_legal_id);
  }

  if (data.imagem) {
    formData.append('imagem', data.imagem);
  }

  data.anexos?.forEach((anexo, index) => {
    formData.append(`anexos[${index}][descricao]`, anexo.descricao);
    formData.append(`anexos[${index}][arquivo]`, anexo.arquivo);
  });

  const response = await api.post('/projects', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function getProjects() {
  const response = await api.get('/projects');
  return response.data as Project[];
}

export async function getProjectById(projectId: string) {
  const response = await api.get(`/projects/${projectId}`);
  return response.data as Project;
}

export async function updateProject(projectId: string, data: UpdateProject) {
  const response = await api.patch(`/projects/${projectId}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

export async function getProjectBudgetItems(projectId: string) {
  const response = await api.get(`/projects/${projectId}/budget-items`);
  return response.data;
}

export async function updateBudgetItems(projectId: string, data: BudgetItem[]) {
  const response = await api.patch(
    `/projects/${projectId}/budget-items`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data;
}

export async function getProjectCronograma(projectId: string) {
  const response = await api.get(`/projects/${projectId}/cronograma`);
  return response.data;
}

export async function updateCronograma(projectId: string, formData: FormData) {
  const response = await api.patch(
    `/projects/${projectId}/cronograma`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
}

export async function changeProjectVisibility(
  projectId: string,
  isPublic: boolean,
) {
  const response = await api.patch(`/projects/${projectId}/visibilidade`, {
    isPublic,
  });

  return response.data;
}

export async function deleteProject(projectId: string) {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
}
