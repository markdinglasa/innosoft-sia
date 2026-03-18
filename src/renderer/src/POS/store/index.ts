import { combineReducers } from '@reduxjs/toolkit'
import managerReducer from './manager'
import syncReducer from '../../App/store/sync'

const posManagerReducer = combineReducers({
  manager: managerReducer,
  sync: syncReducer
})

export default posManagerReducer
