import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { windowReducers } from '../../renderer/src/registry'
import balancesReducer from './balances'
import internalReducer from './internal'
import managerReducer from './manager'

const systemReducer = combineReducers({
  balances: balancesReducer,
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
