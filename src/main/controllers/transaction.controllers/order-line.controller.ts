import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { OrderLineService } from '../../services/transaction.services'

const orderLineService = new OrderLineService()

registerProtectedIpcHandler(TransactionIpcChannel.ORDER_LINE_LIST, async (_event, options) => await orderLineService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.ORDER_LINE_GET, async (_event, id) => await orderLineService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.ORDER_LINE_CREATE, async (_event, { payload, userId }) => await orderLineService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.ORDER_LINE_UPDATE, async (_event, { id, payload, userId }) => await orderLineService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.ORDER_LINE_DELETE, async (_event, { id, userId }) => await orderLineService.delete(id, userId))
