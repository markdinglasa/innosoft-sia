import { getNotificationCounts } from '@shared/selectors';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useNotificationCount = (appId: string): number => {
  const notificationCounts = useSelector(getNotificationCounts);
  return useMemo(() => {
    return notificationCounts[appId] || 0;
  }, [appId, notificationCounts]);
}