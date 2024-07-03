import store from '@shared/store';
import { setNetworkAccountOnlineStatuses } from '@shared/store/networkAccountOnlineStatuses';
import { setPeerRequestDetails } from '@shared/store/peerRequestManager';
import {
  AccountOnlineStatuses,
  Dict,
  OnlineStatus,
  PeerOnlineStatus,
  PeerRequestMethod,
  SocketDataInternal,
  SocketDataInternalMethod,
  WindowDispatch,
} from '@shared/types';
import { displayErrorToast } from '@shared/utils';
import { getPeersValidator, validateCorrelationIdMatchesLastRequestId } from '@shared/validators';

const getAccountOnlineStatuses = (returnValue: Dict<PeerOnlineStatus>): AccountOnlineStatuses => {
  return Object.entries(returnValue).reduce((acc, [key, value]) => {
    return {...acc, [key]: value.is_online ? OnlineStatus.online : OnlineStatus.offline};
  }, {});
};

const getPeersListener = (dispatch: WindowDispatch, networkId: string, socketData: SocketDataInternal) => {
  (async () => {
    try {
      const {
        system: {peerRequestManager},
      } = store.getState();

      const {correlation_id, return_value} = await getPeersValidator.validate(socketData);
      validateCorrelationIdMatchesLastRequestId(
        correlation_id,
        networkId,
        peerRequestManager,
        PeerRequestMethod.getPeers,
      );

      dispatch(
        setPeerRequestDetails({
          networkId,
          peerRequestDetails: {
            lastResponseId: correlation_id,
          },
          peerRequestMethod: PeerRequestMethod.getPeers,
        }),
      );

      dispatch(
        setNetworkAccountOnlineStatuses({
          accountOnlineStatuses: getAccountOnlineStatuses(return_value),
          networkId,
        }),
      );
    } catch (error) {
      console.error(error);
      displayErrorToast(`Invalid ${SocketDataInternalMethod.get_peers} response received`);
    }
  })();
};

export default getPeersListener;
