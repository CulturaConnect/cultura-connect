import api from '@/lib/api';

export async function getNotificationsByUser(userId: string) {
  const response = await api.get(`/notifications/${userId}`);

  return response.data;
}
