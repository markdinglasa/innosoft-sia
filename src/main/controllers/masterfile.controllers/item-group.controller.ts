import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { ItemGroupService } from '../../services/masterfile.services'

const itemGroupService = new ItemGroupService()

registerIpcHandler(MasterfileIpcChannel.ITEM_GROUP_LIST, async (_event, options) => await itemGroupService.list(options))
registerIpcHandler(MasterfileIpcChannel.ITEM_GROUP_GET, async (_event, id) => await itemGroupService.get(id))
registerIpcHandler(MasterfileIpcChannel.ITEM_GROUP_CREATE, async (_event, { payload, userId }) => await itemGroupService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.ITEM_GROUP_UPDATE, async (_event, { id, payload, userId }) => await itemGroupService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.ITEM_GROUP_DELETE, async (_event, { id, userId }) => await itemGroupService.delete(id, userId))
