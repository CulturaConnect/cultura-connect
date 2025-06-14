import api from '@/lib/api';

export async function registerPerson(data) {
  const response = await api.post('/auth/register/person', data);

  return response.data;
}

export async function registerCompany(data) {
  const response = await api.post('/auth/register/company', data);

  return response.data;
}

export async function login(data) {
  const response = await api.post('/auth/login', data);

  return response.data;
}

export async function forgotPassword(email) {
  const response = await api.post('/auth/recover', { email });

  return response.data;
}

export async function resetPassword(data) {
  const response = await api.post('/auth/reset', data);

  return response.data;
}
