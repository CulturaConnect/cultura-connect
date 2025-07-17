import api from '@/lib/api';

export async function updateProfile(data) {
  const response = await api.put('/auth/profile', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function getUserByCpf(cpf: string) {
  const response = await api.get(`/users/search?cpf=${cpf}`);
  return response.data;
}
