import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { SYSTEM_NETWORKS } from '@shared/constants';
import { IpcChannel, Network, Networks } from '@shared/types';
import { setLocalAndStateReducer } from '@shared/utils/ipc';

export const initialState: Networks = {};

const networks = createSlice({
    name: SYSTEM_NETWORKS,
    initialState,
    reducers: {
        _deleteNetwork: (state: Networks, {payload: networkId}: PayloadAction<string>) => {
        delete state[networkId];
        window.electron.ipc.send(IpcChannel.setStoreValue, {key: SYSTEM_NETWORKS, state: current(state)});
        },
        setNetwork: (state: Networks, {payload}: PayloadAction<Network>) => {
        const {networkId} = payload;
        state[networkId] = payload;
        window.electron.ipc.send(IpcChannel.setStoreValue, {key: SYSTEM_NETWORKS, state: current(state)});
        },
        setNetworks: setLocalAndStateReducer<Networks>(SYSTEM_NETWORKS),
    },
});

export const {_deleteNetwork, setNetwork, setNetworks} = networks.actions;
export default networks.reducer;
