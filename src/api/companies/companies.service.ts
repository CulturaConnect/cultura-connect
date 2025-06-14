import api from '@/lib/api';

export async function getCompanyUsers(companyId: string) {
  const response = await api.get(`/companies/${companyId}/users`);
  return response.data;
}
