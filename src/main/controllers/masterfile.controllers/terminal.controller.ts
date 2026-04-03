import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { TerminalService } from '../../services/masterfile.services'

const terminalService = new TerminalService()

registerProtectedIpcHandler(MasterfileIpcChannel.TERMINAL_LIST, async (_event, options) => await terminalService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.TERMINAL_GET, async (_event, id) => await terminalService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.TERMINAL_CREATE, async (_event, { payload, userId }) => await terminalService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.TERMINAL_UPDATE, async (_event, { id, payload, userId }) => await terminalService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.TERMINAL_DELETE, async (_event, { id, userId }) => await terminalService.delete(id, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.TERMINAL_BY_BRANCH, async (_event, branchId) => await terminalService.getByBranch(branchId))
