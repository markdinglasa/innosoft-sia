import { combineReducers } from '@reduxjs/toolkit'
import managerReducer from './manager'
import syncReducer from './sync'

const posManagerReducer = combineReducers({
  manager: managerReducer,
  sync: syncReducer
})

export default posManagerReducer
