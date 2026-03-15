import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { StockCountService } from '../../services/transaction.services'

const stockCountService = new StockCountService()

registerProtectedIpcHandler(TransactionIpcChannel.STOCK_COUNT_LIST, async (_event, options) => await stockCountService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_COUNT_GET, async (_event, id) => await stockCountService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_COUNT_CREATE, async (_event, { payload, userId }) => await stockCountService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_COUNT_UPDATE, async (_event, { id, payload, userId }) => await stockCountService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_COUNT_DELETE, async (_event, { id, userId }) => await stockCountService.delete(id, userId))
