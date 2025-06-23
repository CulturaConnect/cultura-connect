import api from '@/lib/api';

export async function resetCodeCheck(data: { code: string; email: string }) {
  const res = await api.post('/auth/check-code', {
    code: data.code,
    email: data.email,
  });

  return res.data;
}

export async function resetPassword(data: {
  password: string;
  code: string;
  email: string;
}) {
  const res = await api.post('/auth/reset', {
    novaSenha: data.password,
    code: data.code,
    email: data.email,
  });

  return res.data;
}

export async function forgotPassword(email: string) {
  const response = await api.post('/auth/recover', { email });

  return response.data;
}
