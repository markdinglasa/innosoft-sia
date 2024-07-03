import store from '@shared/store';
import { setBalance } from '@shared/store/balances';
import { SocketDataStandard, WindowDispatch } from '@shared/types';
import { displayErrorToast } from '@shared/utils';
import { updateAccountValidator } from '@shared/validators';
import { validateIsSelfAccountNumber } from '@shared/validators/common';

export const updateAccountListener = (dispatch: WindowDispatch, networkId: string, socketData: SocketDataStandard) => {
  (async () => {
    try {
      const {
        system: {self},
      } = store.getState();

      const {message} = await updateAccountValidator.validate(socketData);
      validateIsSelfAccountNumber(message.account_number, self);

      dispatch(setBalance({balance: message.balance, networkId}));
    } catch (error) {
      console.error(error);
      displayErrorToast('Error updating account data');
    }
  })();
};