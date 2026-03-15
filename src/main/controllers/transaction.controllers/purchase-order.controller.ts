import { TransactionIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { PurchaseOrderService } from '../../services/transaction.services'

const purchaseOrderService = new PurchaseOrderService()

registerIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_LIST, async (_event, options) => await purchaseOrderService.list(options))
registerIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_GET, async (_event, id) => await purchaseOrderService.get(id))
registerIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_CREATE, async (_event, { payload, userId }) => await purchaseOrderService.create(payload, userId))
registerIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_UPDATE, async (_event, { id, payload, userId }) => await purchaseOrderService.update(id, payload, userId))
registerIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_DELETE, async (_event, { id, userId }) => await purchaseOrderService.delete(id, userId))
