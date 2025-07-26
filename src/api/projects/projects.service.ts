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

export async function updateCronograma(
  projectId: string,
  cronograma: CronogramaAtividade[],
  evidencias: File[] = [],
) {
  const formData = new FormData();
  formData.append('cronograma_atividades', JSON.stringify(cronograma));
  evidencias.forEach((file, idx) => {
    formData.append(`evidencias[${idx}]`, file);
  });

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
