import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth'
import SplashScreen from './SplashScreen'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AdminRoute({ children }: Props) {
  const { signed, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!signed || user?.tipo !== 'admin') {
      const t = setTimeout(() => {
        navigate('/auth/login', { replace: true })
      }, 500)
      return () => clearTimeout(t)
    }
  }, [signed, user, navigate])

  if (!signed || user?.tipo !== 'admin') {
    return <SplashScreen />
  }

  return <>{children}</>
}
