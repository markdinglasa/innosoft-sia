import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SYSTEM_PEER_REQUEST_MANAGER } from '@shared/constants';
import { PeerRequestDetails, PeerRequestManager, PeerRequestMethod } from '@shared/types';

const initialPeerRequestDetails: PeerRequestDetails = {
  lastRequestDate: null,
  lastRequestId: null,
  lastResponseId: null,
};

export const initialState: PeerRequestManager = {};

const peerRequestManager = createSlice({
    name: SYSTEM_PEER_REQUEST_MANAGER,
    initialState,
    reducers: {
        deleteNetworkPeerRequests: (state: PeerRequestManager, {payload: networkId}: PayloadAction<string>) => {
            delete state[networkId];
        },
        initializeNetworkPeerRequests: (state: PeerRequestManager, {payload: networkId}: PayloadAction<string>) => {
            state[networkId] = {
                getPeers: initialPeerRequestDetails,
                networkId,
                setPeers: initialPeerRequestDetails,
            };
        },
        setPeerRequestDetails: (
            state: PeerRequestManager,
            {
                payload,
            }: PayloadAction<{
                networkId: string;
                peerRequestDetails: Partial<PeerRequestDetails>;
                peerRequestMethod: PeerRequestMethod;
            }>,
            ) => {
            const {networkId, peerRequestDetails, peerRequestMethod} = payload;
            const existingData = state[networkId][peerRequestMethod];
            state[networkId][peerRequestMethod] = {...existingData, ...peerRequestDetails};
        },
    },
});

export const {deleteNetworkPeerRequests, initializeNetworkPeerRequests, setPeerRequestDetails} =
  peerRequestManager.actions;
export default peerRequestManager.reducer;
