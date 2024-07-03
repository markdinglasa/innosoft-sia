import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { SYSTEM_NETWORK_BLOCKS } from '@shared/constants';
import { IpcChannel, NetworkBlock, NetworkBlocks } from '@shared/types';
import { setLocalAndStateReducer } from '@shared/utils/ipc';

export const initialState: NetworkBlocks = {};

const networkBlocks = createSlice({
  initialState,
  name: SYSTEM_NETWORK_BLOCKS,
  reducers: {
    setNetworkBlock: (
      state: NetworkBlocks,
      {payload}: PayloadAction<{networkBlock: NetworkBlock; networkId: string}>,
    ) => {
      const {networkBlock, networkId} = payload;
      const { Id: blockId} = networkBlock;

      if (!state[networkId]) state[networkId] = {};
      state[networkId][blockId] = networkBlock;

      window.electron.ipc.send(IpcChannel.setStoreValue, {key: SYSTEM_NETWORK_BLOCKS, state: current(state)});
    },
    setNetworkBlocks: setLocalAndStateReducer<NetworkBlocks>(SYSTEM_NETWORK_BLOCKS),
  },
});

export const {setNetworkBlock, setNetworkBlocks} = networkBlocks.actions;
export default networkBlocks.reducer;
