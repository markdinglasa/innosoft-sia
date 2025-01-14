import { combineReducers } from '@reduxjs/toolkit'
import managerReducer from './manager'
import settingsReducer from './settings'

const siaManagerReducer = combineReducers({
  manager: managerReducer,
  settings: settingsReducer
})

export default siaManagerReducer
