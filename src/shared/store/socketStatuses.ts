import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';

import { SYSTEM_SOCKET_STATUSES } from '@shared/constants';
import { IpcChannel, SocketStatus, SocketStatuses } from '@shared/types';
import { setLocalAndStateReducer } from '@shared/utils/ipc';

export const initialState: SocketStatuses = {};

const socketStatuses = createSlice({
  initialState,
  name: SYSTEM_SOCKET_STATUSES,
  reducers: {
    _deleteSocketStatus: (state: SocketStatuses, {payload: networkId}: PayloadAction<string>) => {
      delete state[networkId];
      window.electron.ipc.send(IpcChannel.setStoreValue, {key: SYSTEM_SOCKET_STATUSES, state: current(state)});
    },
    _initializeSocketStatus: (state: SocketStatuses, {payload: networkId}: PayloadAction<string>) => {
      state[networkId] = SocketStatus.disconnected;
      window.electron.ipc.send(IpcChannel.setStoreValue, {key: SYSTEM_SOCKET_STATUSES, state: current(state)});
    },
    initializeSocketStatuses: (state: SocketStatuses) => {
      for (const networkId of Object.keys(state)) {
        state[networkId] = SocketStatus.disconnected;
      }
      window.electron.ipc.send(IpcChannel.setStoreValue, {key: SYSTEM_SOCKET_STATUSES, state: current(state)});
    },
    setSocketStatus: (
      state: SocketStatuses,
      {payload}: PayloadAction<{networkId: string; socketStatus: SocketStatus}>,
    ) => {
      const {networkId, socketStatus} = payload;
      state[networkId] = socketStatus;
      window.electron.ipc.send(IpcChannel.setStoreValue, {key: SYSTEM_SOCKET_STATUSES, state: current(state)});
    },
    setSocketStatuses: setLocalAndStateReducer<SocketStatuses>(SYSTEM_SOCKET_STATUSES),
  },
});

export const {
  _deleteSocketStatus,
  _initializeSocketStatus,
  initializeSocketStatuses,
  setSocketStatus,
  setSocketStatuses,
} = socketStatuses.actions;
export default socketStatuses.reducer;
