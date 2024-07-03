import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { SYSTEM_SELF } from '@shared/constants';
import { IpcChannel, Self } from '@shared/types';
import { setLocalAndStateReducer } from '@shared/utils/ipc';

export const initialState: Self = {
  accountNumber: '',
  displayImage: '',
  displayName: '',
  signingKey: '',
};

const self = createSlice({
  initialState,
  name: SYSTEM_SELF,
  reducers: {
    setSelf: setLocalAndStateReducer<Self>(SYSTEM_SELF),
    updateSelf: (state: Self, {payload}: PayloadAction<Partial<Self>>) => {
      Object.assign(state, payload);
      window.electron.ipc.send(IpcChannel.setStoreValue, {key: SYSTEM_SELF, state: current(state)});
    },
  },
});

export const {setSelf, updateSelf} = self.actions;
export default self.reducer;
