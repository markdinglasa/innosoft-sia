import { combineReducers } from '@reduxjs/toolkit'
import managerReducer from './manager'
import settingsReducer from './settings'
import syncReducer from './sync'

const siaManagerReducer = combineReducers({
  manager: managerReducer,
  settings: settingsReducer,
  sync: syncReducer
})

export default siaManagerReducer
