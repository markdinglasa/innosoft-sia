import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SYSTEM_NETWORK_ACCOUNT_ONLINE_STATUSES } from '@shared/constants';
import { AccountOnlineStatuses, NetworkAccountOnlineStatuses } from '@shared/types';

export const initialState: NetworkAccountOnlineStatuses = {};

const networkAccountOnlineStatuses = createSlice({
    name: SYSTEM_NETWORK_ACCOUNT_ONLINE_STATUSES,
    initialState,
    reducers: {
        deleteNetworkAccountOnlineStatuses: ( state: NetworkAccountOnlineStatuses, {payload: networkId}: PayloadAction<string>, ) => { delete state[networkId]; },
        setNetworkAccountOnlineStatuses: ( state: NetworkAccountOnlineStatuses, {payload}: PayloadAction<{accountOnlineStatuses: AccountOnlineStatuses; networkId: string}>,) => {
            const {accountOnlineStatuses, networkId} = payload;
            let networkDict = state[networkId];

            if (!networkDict) {
                state[networkId] = {};
                networkDict = {};
            }
            state[networkId] = {...networkDict, ...accountOnlineStatuses};
        },
    },
});

export const {deleteNetworkAccountOnlineStatuses, setNetworkAccountOnlineStatuses} = networkAccountOnlineStatuses.actions;
export default networkAccountOnlineStatuses.reducer;
