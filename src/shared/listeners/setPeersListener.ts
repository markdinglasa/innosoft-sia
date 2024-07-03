import store from '@shared/store';
import { setPeerRequestDetails } from '@shared/store/peerRequestManager';
import { PeerRequestMethod, SocketDataInternal, SocketDataInternalMethod, WindowDispatch } from '@shared/types';
import { displayErrorToast } from '@shared/utils';
import { setPeersValidator, validateCorrelationIdMatchesLastRequestId } from '@shared/validators';

export const setPeersListener = (dispatch: WindowDispatch, networkId: string, socketData: SocketDataInternal) => {
  (async () => {
    try {
      const {
        system: {peerRequestManager},
      } = store.getState();

      const {correlation_id} = await setPeersValidator.validate(socketData);
      validateCorrelationIdMatchesLastRequestId(
        correlation_id,
        networkId,
        peerRequestManager,
        PeerRequestMethod.setPeers,
      );

      dispatch(
        setPeerRequestDetails({
          networkId,
          peerRequestDetails: {
            lastResponseId: correlation_id,
          },
          peerRequestMethod: PeerRequestMethod.setPeers,
        }),
      );
    } catch (error) {
      console.error(error);
      displayErrorToast(`Invalid ${SocketDataInternalMethod.set_peers} response received`);
    }
  })();
};

