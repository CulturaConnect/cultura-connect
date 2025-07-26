import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminRoute from '@/components/auth/AdminRoute'
import { vi } from 'vitest'

const mockAuth: { signed: boolean; user: unknown } = { signed: false, user: null }

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual: Record<string, unknown> = await vi.importActual(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@/contexts/auth', () => ({
  useAuth: () => mockAuth,
}))

function renderWithAuth(user: unknown) {
  mockAuth.signed = !!user
  mockAuth.user = user

  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <div>Admin Content</div>
            </AdminRoute>
          }
        />
        <Route path="/auth/login" element={<div>Login</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminRoute', () => {
  it('redirects non-admin users to login', async () => {
    renderWithAuth({ tipo: 'person' })
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true })
    })
  })

  it('allows admin users to access', () => {
    renderWithAuth({ tipo: 'admin' })
    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })
})
