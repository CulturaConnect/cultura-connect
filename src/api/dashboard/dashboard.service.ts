import api from '@/lib/api'

export interface MetricCount {
  name: string
  count: number
}

export interface AdminMetrics {
  totalProjects: number
  projectsByStatus: MetricCount[]
  totalUsers?: number
  totalCompanies?: number
  projectsBySegment?: MetricCount[]
  usersByType?: MetricCount[]
  projectsByMonth?: { month: string; count: number }[]
}

export async function getAdminMetrics() {
  const response = await api.get<AdminMetrics>('/admin/metrics')
  return response.data
}
