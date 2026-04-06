import { UtilityIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { SysUserTerminalService } from '../../services/utility.services'
import { TerminalService } from '../../services/masterfile.services'
import Store from '../../store/Store'
import { ipcMain } from 'electron'
import { verifyToken } from '../../common/utils/jwt.util'
import { SYSTEM_ACCESS_TOKEN } from '@shared/constants'

const sysUserTerminalService = new SysUserTerminalService()
const terminalService = new TerminalService()

registerProtectedIpcHandler(UtilityIpcChannel.USER_TERMINAL_LIST, async (_event, options) => await sysUserTerminalService.list(options))
registerProtectedIpcHandler(UtilityIpcChannel.USER_TERMINAL_GET, async (_event, id) => await sysUserTerminalService.get(id))
registerProtectedIpcHandler(UtilityIpcChannel.USER_TERMINAL_CREATE, async (_event, { payload, userId }) => await sysUserTerminalService.create(payload, userId))
registerProtectedIpcHandler(UtilityIpcChannel.USER_TERMINAL_UPDATE, async (_event, { id, payload, userId }) => await sysUserTerminalService.update(id, payload, userId))
registerProtectedIpcHandler(UtilityIpcChannel.USER_TERMINAL_DELETE, async (_event, { id, userId }) => await sysUserTerminalService.delete(id, userId))

ipcMain.handle(UtilityIpcChannel.USER_TERMINAL_GET_ACTIVE, () => {
    return Store.get('activeTerminalId' as any)
})

ipcMain.handle(UtilityIpcChannel.USER_TERMINAL_SET_ACTIVE, (_event, terminalId: number) => {
    Store.set('activeTerminalId' as any, terminalId)
    return { success: true }
})

registerProtectedIpcHandler(UtilityIpcChannel.USER_TERMINAL_ACTIVATE, async (_event, { terminalId }) => {
    await terminalService.activateTerminal(terminalId)
    
    // Extract userId from current session token
    const token = Store.get(SYSTEM_ACCESS_TOKEN as any)
    if (!token) throw new Error('Unauthorized')
    
    const { userId } = verifyToken(token as string)
    
    // Save as user's preference
    await sysUserTerminalService.activateForUser(userId, terminalId)
    
    return { success: true }
})
