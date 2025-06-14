import { useQuery } from '@tanstack/react-query';
import { getCompanyUsers } from './companies.service';

export function useGetCompanyUsers(companyId: string) {
  return useQuery({
    queryKey: ['companyUsers', companyId],
    queryFn: async () => getCompanyUsers(companyId),
    enabled: !!companyId,
  });
}
