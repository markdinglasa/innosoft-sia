import { combineReducers } from '@reduxjs/toolkit'
import managerReducer from './manager'

const posManagerReducer = combineReducers({
  manager: managerReducer
})

export default posManagerReducer
