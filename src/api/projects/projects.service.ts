import api from '@/lib/api';
import { CreateProject } from './types';

export async function createProject(data: CreateProject) {
  const formData = new FormData();

  formData.append('nome', data.nome);
  formData.append('segmento', data.segmento ?? '');
  formData.append('inicio', data.inicio);
  formData.append('fim', data.fim);

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
  formData.append('orcamento_previsto', data.orcamento_previsto ?? '');
  formData.append('orcamento_gasto', data.orcamento_gasto ?? '');
  formData.append('responsavel_principal_id', data.responsavel_principal_id);
  formData.append('responsavel_legal_id', data.responsavel_legal_id);

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
  return response.data;
}

export async function getProjectById(projectId: string) {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
}
