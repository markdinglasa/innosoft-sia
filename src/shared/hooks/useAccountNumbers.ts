import { getAccounts } from '@shared/selectors/state';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useAccountNumbers = (): string[] => {
  const accounts = useSelector(getAccounts);
  const accountNumbersString = useMemo(() => Object.keys(accounts).sort().join('-'), [accounts]);

  return useMemo(
    () => accountNumbersString.split('-').filter((accountNumber) => !!accountNumber),
    [accountNumbersString],
  );
};
