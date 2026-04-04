export * from './ipcApi'
export * from './masterfileIpc'
export * from './shiftIpc'

import { registerMasterfileHandlers } from './masterfileIpc'
import { registerShiftHandlers } from './shiftIpc'
import { registerOrderHandlers } from './orderIpc'
import { registerReportHandlers } from './reportIpc'

registerMasterfileHandlers()
registerShiftHandlers()
registerOrderHandlers()
registerReportHandlers()
