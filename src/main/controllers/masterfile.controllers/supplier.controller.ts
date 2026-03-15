import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { SupplierService } from '../../services/masterfile.services'

const supplierService = new SupplierService()

registerIpcHandler(MasterfileIpcChannel.SUPPLIER_LIST, async (_event, options) => await supplierService.list(options))
registerIpcHandler(MasterfileIpcChannel.SUPPLIER_GET, async (_event, id) => await supplierService.get(id))
registerIpcHandler(MasterfileIpcChannel.SUPPLIER_CREATE, async (_event, { payload, userId }) => await supplierService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.SUPPLIER_UPDATE, async (_event, { id, payload, userId }) => await supplierService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.SUPPLIER_DELETE, async (_event, { id, userId }) => await supplierService.delete(id, userId))
