import { getAccountOnlineStatuses } from '@shared/selectors';
import { OnlineStatus } from '@shared/types';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useOnlineAccountNumbers = (): string[] => {
  const accountOnlineStatuses = useSelector(getAccountOnlineStatuses);
  return useMemo(() => {
    return Object.keys(accountOnlineStatuses).filter(
      (accountNumber) => accountOnlineStatuses[accountNumber] === OnlineStatus.online,
    );
  }, [accountOnlineStatuses]);
}