import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAccountNumbers } from '@shared/hooks';
import { getNetworkAccountOnlineStatuses } from '@shared/selectors/state';
import { setAccountOnlineStatuses } from '@shared/store/accountOnlineStatuses';
import { AccountOnlineStatuses, OnlineStatus, WindowDispatch } from '@shared/types';

export const useAccountOnlineStatusManager = () => {
  const accountNumbers = useAccountNumbers();
  const dispatch = useDispatch<WindowDispatch>();
  const networkAccountOnlineStatuses = useSelector(getNetworkAccountOnlineStatuses);

  useEffect(() => {
    const results: AccountOnlineStatuses = accountNumbers.reduce(
      (acc, accountNumber) => ({...acc, [accountNumber]: OnlineStatus.offline}),
      {},
    );

    for (const accountOnlineStatuses of Object.values(networkAccountOnlineStatuses)) {
      for (const [accountNumber, onlineStatus] of Object.entries(accountOnlineStatuses)) {
        if (onlineStatus === OnlineStatus.online) {
          results[accountNumber] = onlineStatus;
        }
      }
    }

    dispatch(setAccountOnlineStatuses(results));
  }, [accountNumbers, dispatch, networkAccountOnlineStatuses]);
};