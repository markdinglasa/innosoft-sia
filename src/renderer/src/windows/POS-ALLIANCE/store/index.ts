import { combineReducers } from '@reduxjs/toolkit'

import managerReducer from './manager'

const allianceReducer = combineReducers({
  manager: managerReducer
})

export default allianceReducer
