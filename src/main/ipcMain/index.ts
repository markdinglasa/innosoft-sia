export * from './ipcApi'
export * from './masterfileIpc'
export * from './shiftIpc'

import { registerMasterfileHandlers } from './masterfileIpc'
import { registerShiftHandlers } from './shiftIpc'

registerMasterfileHandlers()
registerShiftHandlers()
