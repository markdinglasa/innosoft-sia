import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { ItemService } from '../../services/masterfile.services'

const itemService = new ItemService()
// Items IPC
registerIpcHandler('masterfiles:item:list', async (_event, options) => await itemService.list(options))
registerIpcHandler('masterfiles:item:get', async (_event, id) => await itemService.get(id))
registerIpcHandler('masterfiles:item:create', async (_event, payload) => await itemService.create(payload))
registerIpcHandler('masterfiles:item:update', async (_event, { id, payload }) => await itemService.update(id, payload))
registerIpcHandler('masterfiles:item:delete', async (_event, id) => await itemService.delete(id))
