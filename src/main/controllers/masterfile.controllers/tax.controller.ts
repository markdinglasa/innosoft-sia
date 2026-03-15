import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { TaxService } from '../../services/masterfile.services'

const taxService = new TaxService()

registerIpcHandler(MasterfileIpcChannel.TAX_LIST, async (_event, options) => await taxService.list(options))
registerIpcHandler(MasterfileIpcChannel.TAX_GET, async (_event, id) => await taxService.get(id))
registerIpcHandler(MasterfileIpcChannel.TAX_CREATE, async (_event, { payload, userId }) => await taxService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.TAX_UPDATE, async (_event, { id, payload, userId }) => await taxService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.TAX_DELETE, async (_event, { id, userId }) => await taxService.delete(id, userId))
