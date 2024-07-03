import { getAccountOnlineStatuses, getSelf } from '@shared/selectors/state';
import { OnlineStatus } from '@shared/types';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useAccountOnlineStatus = (accountNumber: string): OnlineStatus => {
  const accountOnlineStatuses = useSelector(getAccountOnlineStatuses);
  const self = useSelector(getSelf);

  return useMemo(() => {
    if (accountNumber === self.accountNumber) return OnlineStatus.online;
    const accountOnlineStatus = accountOnlineStatuses[accountNumber];
    return accountOnlineStatus || OnlineStatus.offline;
  }, [accountNumber, accountOnlineStatuses, self.accountNumber]);
};
