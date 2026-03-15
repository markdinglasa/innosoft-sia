import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { ItemService } from '../../services/masterfile.services'

const itemService = new ItemService()

registerIpcHandler(MasterfileIpcChannel.ITEM_LIST, async (_event, options) => await itemService.list(options))
registerIpcHandler(MasterfileIpcChannel.ITEM_GET, async (_event, id) => await itemService.get(id))
registerIpcHandler(MasterfileIpcChannel.ITEM_CREATE, async (_event, { payload, userId }) => await itemService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.ITEM_UPDATE, async (_event, { id, payload, userId }) => await itemService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.ITEM_DELETE, async (_event, { id, userId }) => await itemService.delete(id, userId))
