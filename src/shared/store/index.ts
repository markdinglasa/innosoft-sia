import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { AppReducers } from '../../renderer/src/registry'
import internalReducer from './internal'
import managerReducer from './manager'

const systemReducer = combineReducers({
  manager: managerReducer,
  internal: internalReducer
})

const store = configureStore({
  reducer: {
    ...AppReducers,
    system: systemReducer
  }
})

export default store
