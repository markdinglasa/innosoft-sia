import { combineReducers } from '@reduxjs/toolkit'

import managerReducer from './manager'

const siaReducer = combineReducers({
  manager: managerReducer
})

export default siaReducer
