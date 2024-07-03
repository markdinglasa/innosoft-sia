import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { windowReducers } from '../../renderer/src/registry'

import accountsReducer from './account'
import accountOnlineStatusesReducer from './accountOnlineStatuses'
import balancesReducer from './balances'
import internalReducer from './internal'
import managerReducer from './manager'
import networkAccountOnlineStatusesReducer from './networkAccountOnlineStatuses'
import networkBlocksReducer from './networkBlocks'
import networkCorrelationIdsReducer from './networkCorrelationIds'
import networksReducer from './networks'
import notificationCountsReducer from './notificationCounts'
import peerRequestManagerReducer from './peerRequestManager'
import selfReducer from './self'
import socketStatusesReducer from './socketStatuses'

const systemReducer = combineReducers({
  socketStatuses: socketStatusesReducer,
  networkAccountOnlineStatuses: networkAccountOnlineStatusesReducer,
  networkBlocks: networkBlocksReducer,
  networkCorrelationIds: networkCorrelationIdsReducer,
  networks: networksReducer,
  notificationCounts: notificationCountsReducer,
  peerRequestManager: peerRequestManagerReducer,
  balances: balancesReducer,
  accountOnlineStatuses: accountOnlineStatusesReducer,
  self: selfReducer,
  accounts: accountsReducer,
  manager: managerReducer,
  internal: internalReducer
})

const store = configureStore({
  reducer: {
    ...windowReducers,
    system: systemReducer
  }
})

export default store
