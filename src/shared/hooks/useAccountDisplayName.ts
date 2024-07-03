import { getAccounts, getSelf } from '@shared/selectors/state';
import { truncate } from '@shared/utils';
import { useSelector } from 'react-redux';

export const useAccountDisplayName = (accountNumber: string, maxLength?: number) => {
  const accounts = useSelector(getAccounts);
  const self = useSelector(getSelf);

  const account = self.accountNumber === accountNumber ? self : accounts[accountNumber];
  const results = account?.displayName || accountNumber;

  return maxLength ? truncate(results, maxLength) : results;
};

