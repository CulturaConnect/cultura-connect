import { useAuth } from '@/contexts/auth'
import PersonProfile from './profile-person'
import CompanyProfile from './profile-company'

export default function Profile() {
  const { user } = useAuth()

  if (!user) return null

  if (user.tipo === 'company') {
    return <CompanyProfile />
  }

  return <PersonProfile />
}
