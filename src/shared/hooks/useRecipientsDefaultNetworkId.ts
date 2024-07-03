import { getBalances, getNetworkAccountOnlineStatuses } from '@shared/selectors';
import { getRecipientsDefaultNetworkId } from '@shared/utils/networks';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useRecipientsDefaultNetworkId = (recipient: string): string | null => {
  const balances = useSelector(getBalances);
  const networkAccountOnlineStatuses = useSelector(getNetworkAccountOnlineStatuses);
  return useMemo(() => {
    return getRecipientsDefaultNetworkId({balances, networkAccountOnlineStatuses, recipient});
  }, [balances, networkAccountOnlineStatuses, recipient]);
};
