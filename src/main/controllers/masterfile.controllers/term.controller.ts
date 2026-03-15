import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { TermService } from '../../services/masterfile.services'

const termService = new TermService()

registerProtectedIpcHandler(MasterfileIpcChannel.TERM_LIST, async (_event, options) => await termService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.TERM_GET, async (_event, id) => await termService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.TERM_CREATE, async (_event, { payload, userId }) => await termService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.TERM_UPDATE, async (_event, { id, payload, userId }) => await termService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.TERM_DELETE, async (_event, { id, userId }) => await termService.delete(id, userId))
