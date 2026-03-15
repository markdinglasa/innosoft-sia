import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { StockInService } from '../../services/transaction.services'

const stockInService = new StockInService()

registerProtectedIpcHandler(TransactionIpcChannel.STOCK_IN_LIST, async (_event, options) => await stockInService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_IN_GET, async (_event, id) => await stockInService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_IN_CREATE, async (_event, { payload, userId }) => await stockInService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_IN_UPDATE, async (_event, { id, payload, userId }) => await stockInService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_IN_DELETE, async (_event, { id, userId }) => await stockInService.delete(id, userId))
