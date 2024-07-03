import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SYSTEM_ACCOUNT_ONLINE_STATUSES } from '@shared/constants';
import { AccountOnlineStatuses } from '@shared/types';

export const initialState: AccountOnlineStatuses = {};

const accountOnlineStatuses = createSlice({
    name: SYSTEM_ACCOUNT_ONLINE_STATUSES,
    initialState,
    reducers: {
        setAccountOnlineStatuses: (_: AccountOnlineStatuses, {payload}: PayloadAction<AccountOnlineStatuses>) => {
        return payload;
        },
    },
});

export const {setAccountOnlineStatuses} = accountOnlineStatuses.actions;
export default accountOnlineStatuses.reducer;
