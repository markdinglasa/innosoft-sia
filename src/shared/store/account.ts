import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { SYSTEM_ACCOUNTS } from '@shared/constants';
import { Account, Accounts, IpcChannel } from '@shared/types';
import { setLocalAndStateReducer } from '@shared/utils/ipc';

export const initialState: Accounts = {};

const accounts = createSlice({
  name: SYSTEM_ACCOUNTS,
  initialState,
  reducers: {
    deleteAccount: (state: Accounts, {payload: accountNumber}: PayloadAction<string>) => {
      delete state[accountNumber];
      window.electron.ipc.send(IpcChannel.setStoreValue, {key: SYSTEM_ACCOUNTS, state: current(state)});
    },
    setAccount: (state: Accounts, {payload}: PayloadAction<Account>) => {
      const {accountNumber} = payload;
      state[accountNumber] = payload;
      window.electron.ipc.send(IpcChannel.setStoreValue, {key: SYSTEM_ACCOUNTS, state: current(state)});
    },
    setAccounts: setLocalAndStateReducer<Accounts>(SYSTEM_ACCOUNTS),
  },
});

export const {deleteAccount, setAccount, setAccounts} = accounts.actions;
export default accounts.reducer;
