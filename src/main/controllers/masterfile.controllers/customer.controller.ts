import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { CustomerService } from '../../services/masterfile.services'

const customerService = new CustomerService()
// Customers IPC
registerIpcHandler('masterfiles:customer:list', async (_event, options) => await customerService.list(options))
registerIpcHandler('masterfiles:customer:get', async (_event, id) => await customerService.get(id))
registerIpcHandler('masterfiles:customer:create', async (_event, payload) => await customerService.create(payload))
registerIpcHandler('masterfiles:customer:update', async (_event, { id, payload }) => await customerService.update(id, payload))
registerIpcHandler('masterfiles:customer:delete', async (_event, id) => await customerService.delete(id))
