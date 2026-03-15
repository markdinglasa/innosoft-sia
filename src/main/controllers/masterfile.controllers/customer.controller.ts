import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { CustomerService } from '../../services/masterfile.services'

const customerService = new CustomerService()

registerProtectedIpcHandler(MasterfileIpcChannel.CUSTOMER_LIST, async (_event, options) => await customerService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.CUSTOMER_GET, async (_event, id) => await customerService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.CUSTOMER_CREATE, async (_event, { payload, userId }) => await customerService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.CUSTOMER_UPDATE, async (_event, { id, payload, userId }) => await customerService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.CUSTOMER_DELETE, async (_event, { id, userId }) => await customerService.delete(id, userId))
