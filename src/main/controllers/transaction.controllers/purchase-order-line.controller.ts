import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { PurchaseOrderLineService } from '../../services/transaction.services'

const purchaseOrderLineService = new PurchaseOrderLineService()

registerProtectedIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_LINE_LIST, async (_event, options) => await purchaseOrderLineService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_LINE_GET, async (_event, id) => await purchaseOrderLineService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_LINE_CREATE, async (_event, { payload, userId }) => await purchaseOrderLineService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_LINE_UPDATE, async (_event, { id, payload, userId }) => await purchaseOrderLineService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.PURCHASE_ORDER_LINE_DELETE, async (_event, { id, userId }) => await purchaseOrderLineService.delete(id, userId))
