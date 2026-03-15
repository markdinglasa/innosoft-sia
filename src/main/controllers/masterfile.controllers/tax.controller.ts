import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { TaxService } from '../../services/masterfile.services'

const taxService = new TaxService()

registerProtectedIpcHandler(MasterfileIpcChannel.TAX_LIST, async (_event, options) => await taxService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.TAX_GET, async (_event, id) => await taxService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.TAX_CREATE, async (_event, { payload, userId }) => await taxService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.TAX_UPDATE, async (_event, { id, payload, userId }) => await taxService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.TAX_DELETE, async (_event, { id, userId }) => await taxService.delete(id, userId))
