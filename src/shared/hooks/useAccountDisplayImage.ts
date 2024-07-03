import DefaultAvatar from '@shared/assets/default-avatar.png';
import { getAccounts, getSelf } from '@shared/selectors/state';
import { useSelector } from 'react-redux';

export const useAccountDisplayImage = (accountNumber: string) => {
  const accounts = useSelector(getAccounts);
  const self = useSelector(getSelf);

  const account = self.accountNumber === accountNumber ? self : accounts[accountNumber];

  return account?.displayImage || DefaultAvatar;
};


