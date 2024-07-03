import store from '@shared/store';
import { setNetworkAccountOnlineStatuses } from '@shared/store/networkAccountOnlineStatuses';
import { OnlineStatus, SocketDataStandard, WindowDispatch } from '@shared/types';
import { displayErrorToast } from '@shared/utils/toast';
import {
  trackOnlineStatusValidator,
  validateIsKnownAccount,
  validateIsNotSelfAccountNumber,
} from '@shared/validators';

export const trackOnlineStatusListener = (dispatch: WindowDispatch, networkId: string, socketData: SocketDataStandard) => {
  (async () => {
    try {
      const {
        system: {accounts, self},
      } = store.getState();

      const {account_number: accountNumber, is_online: isOnline} = await trackOnlineStatusValidator.validate(
        socketData,
      );
      validateIsKnownAccount(accountNumber, accounts);
      validateIsNotSelfAccountNumber(accountNumber, self);

      dispatch(
        setNetworkAccountOnlineStatuses({
          accountOnlineStatuses: {
            [accountNumber]: isOnline ? OnlineStatus.online : OnlineStatus.offline,
          },
          networkId,
        }),
      );
    } catch (error) {
      console.error(error);
      displayErrorToast('Error tracking online status');
    }
  })();
};