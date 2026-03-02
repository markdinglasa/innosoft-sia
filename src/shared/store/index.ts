import { combineReducers, configureStore } from '@reduxjs/toolkit'

import internalReducer from './internal'
import managerReducer from './manager'

const systemReducer = combineReducers({
  manager: managerReducer,
  internal: internalReducer
})

const store = configureStore({
  reducer: {
    system: systemReducer
  }
})

export default store
