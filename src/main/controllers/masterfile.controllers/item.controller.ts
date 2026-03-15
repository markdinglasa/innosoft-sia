import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { ItemService } from '../../services/masterfile.services'

const itemService = new ItemService()

registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_LIST, async (_event, options) => await itemService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_GET, async (_event, id) => await itemService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_CREATE, async (_event, { payload, userId }) => await itemService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_UPDATE, async (_event, { id, payload, userId }) => await itemService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_DELETE, async (_event, { id, userId }) => await itemService.delete(id, userId))
