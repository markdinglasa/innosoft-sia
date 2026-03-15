import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { OrderService } from '../../services/transaction.services'

const orderService = new OrderService()

registerProtectedIpcHandler(TransactionIpcChannel.ORDER_LIST, async (_event, options) => await orderService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.ORDER_GET, async (_event, id) => await orderService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.ORDER_CREATE, async (_event, { payload, userId }) => await orderService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.ORDER_UPDATE, async (_event, { id, payload, userId }) => await orderService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.ORDER_DELETE, async (_event, { id, userId }) => await orderService.delete(id, userId))
