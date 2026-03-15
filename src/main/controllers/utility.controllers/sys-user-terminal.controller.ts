import { UtilityIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { SysUserTerminalService } from '../../services/utility.services'

const sysUserTerminalService = new SysUserTerminalService()

registerProtectedIpcHandler(UtilityIpcChannel.USER_TERMINAL_LIST, async (_event, options) => await sysUserTerminalService.list(options))
registerProtectedIpcHandler(UtilityIpcChannel.USER_TERMINAL_GET, async (_event, id) => await sysUserTerminalService.get(id))
registerProtectedIpcHandler(UtilityIpcChannel.USER_TERMINAL_CREATE, async (_event, { payload, userId }) => await sysUserTerminalService.create(payload, userId))
registerProtectedIpcHandler(UtilityIpcChannel.USER_TERMINAL_UPDATE, async (_event, { id, payload, userId }) => await sysUserTerminalService.update(id, payload, userId))
registerProtectedIpcHandler(UtilityIpcChannel.USER_TERMINAL_DELETE, async (_event, { id, userId }) => await sysUserTerminalService.delete(id, userId))
