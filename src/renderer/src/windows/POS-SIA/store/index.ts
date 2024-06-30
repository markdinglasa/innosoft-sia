import { combineReducers } from '@reduxjs/toolkit'

import managerReducer from './manager'

const databaseManagerReducer = combineReducers({
  manager: managerReducer
})

export default databaseManagerReducer
