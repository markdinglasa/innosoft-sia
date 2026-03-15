import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { TerminalService } from '../../services/masterfile.services'

const terminalService = new TerminalService()

registerIpcHandler(MasterfileIpcChannel.TERMINAL_LIST, async (_event, options) => await terminalService.list(options))
registerIpcHandler(MasterfileIpcChannel.TERMINAL_GET, async (_event, id) => await terminalService.get(id))
registerIpcHandler(MasterfileIpcChannel.TERMINAL_CREATE, async (_event, { payload, userId }) => await terminalService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.TERMINAL_UPDATE, async (_event, { id, payload, userId }) => await terminalService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.TERMINAL_DELETE, async (_event, { id, userId }) => await terminalService.delete(id, userId))
