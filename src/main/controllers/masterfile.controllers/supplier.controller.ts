import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { SupplierService } from '../../services/masterfile.services'

const supplierService = new SupplierService()

registerProtectedIpcHandler(MasterfileIpcChannel.SUPPLIER_LIST, async (_event, options) => await supplierService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.SUPPLIER_GET, async (_event, id) => await supplierService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.SUPPLIER_CREATE, async (_event, { payload, userId }) => await supplierService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.SUPPLIER_UPDATE, async (_event, { id, payload, userId }) => await supplierService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.SUPPLIER_DELETE, async (_event, { id, userId }) => await supplierService.delete(id, userId))
