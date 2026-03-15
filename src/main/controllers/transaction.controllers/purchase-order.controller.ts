import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { PurchaseOrderService } from '../../services/transaction.services'

const purchaseOrderService = new PurchaseOrderService()

registerProtectedIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_LIST, async (_event, options) => await purchaseOrderService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_GET, async (_event, id) => await purchaseOrderService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_CREATE, async (_event, { payload, userId }) => await purchaseOrderService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_UPDATE, async (_event, { id, payload, userId }) => await purchaseOrderService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_DELETE, async (_event, { id, userId }) => await purchaseOrderService.delete(id, userId))
