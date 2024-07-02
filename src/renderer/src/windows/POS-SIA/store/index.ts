import { combineReducers } from '@reduxjs/toolkit'

import managerReducer from './manager'

const siaManagerReducer = combineReducers({
  manager: managerReducer
})

export default siaManagerReducer
