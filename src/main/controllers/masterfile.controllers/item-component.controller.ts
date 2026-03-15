import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { ItemComponentService } from '../../services/masterfile.services'

const itemComponentService = new ItemComponentService()

registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_COMPONENT_LIST, async (_event, options) => await itemComponentService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_COMPONENT_GET, async (_event, id) => await itemComponentService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_COMPONENT_CREATE, async (_event, { payload, userId }) => await itemComponentService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_COMPONENT_UPDATE, async (_event, { id, payload, userId }) => await itemComponentService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.ITEM_COMPONENT_DELETE, async (_event, { id, userId }) => await itemComponentService.delete(id, userId))
