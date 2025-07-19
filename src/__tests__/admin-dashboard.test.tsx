import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminDashboard from '@/pages/admin-dashboard'
import { vi } from 'vitest'

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(() => Promise.reject(new Error('error'))),
  },
}))

describe('AdminDashboard', () => {
  it('shows placeholder when there is no data', async () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <AdminDashboard />
      </QueryClientProvider>,
    )
    expect(await screen.findByText('Nenhum dado encontrado')).toBeInTheDocument()
  })
})
