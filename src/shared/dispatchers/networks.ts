import { _deleteBalance, _initializeBalance } from '@shared/store/balances';
import { _deleteNetwork } from '@shared/store/networks';
import { _deleteSocketStatus, _initializeSocketStatus } from '@shared/store/socketStatuses';
import { WindowDispatch } from '@shared/types';

export const deleteNetwork = (networkId: string) => async (dispatch: WindowDispatch) => {
  dispatch(_deleteNetwork(networkId));
  dispatch(_deleteBalance(networkId));
  dispatch(_deleteSocketStatus(networkId));
};

export const initializeNetworkRelatedObjects = (networkId: string) => async (dispatch: WindowDispatch) => {
  dispatch(_initializeBalance(networkId));
  dispatch(_initializeSocketStatus(networkId));
};
