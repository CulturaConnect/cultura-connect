import { useQuery } from '@tanstack/react-query';
import { getNotificationsByUser } from './notifications.service';

export const useNotificationsQueries = (userId: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => getNotificationsByUser(userId),
    enabled: !!userId,
  });
};
