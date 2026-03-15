import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { ItemGroupItemService } from '../../services/masterfile.services'

const itemGroupItemService = new ItemGroupItemService()

registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_GROUP_ITEM_LIST, async (_event, options) => await itemGroupItemService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_GROUP_ITEM_GET, async (_event, id) => await itemGroupItemService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_GROUP_ITEM_CREATE, async (_event, { payload, userId }) => await itemGroupItemService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_GROUP_ITEM_UPDATE, async (_event, { id, payload, userId }) => await itemGroupItemService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_GROUP_ITEM_DELETE, async (_event, { id, userId }) => await itemGroupItemService.delete(id, userId))
