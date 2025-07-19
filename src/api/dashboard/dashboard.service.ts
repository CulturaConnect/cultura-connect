import api from '@/lib/api'

export async function getAdminMetrics() {
  const response = await api.get('/admin/metrics')
  return response.data
}
