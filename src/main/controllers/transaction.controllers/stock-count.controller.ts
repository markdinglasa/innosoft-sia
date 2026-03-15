import { TransactionIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { StockCountService } from '../../services/transaction.services'

const stockCountService = new StockCountService()

registerIpcHandler(TransactionIpcChannel.STOCK_COUNT_LIST, async (_event, options) => await stockCountService.list(options))
registerIpcHandler(TransactionIpcChannel.STOCK_COUNT_GET, async (_event, id) => await stockCountService.get(id))
registerIpcHandler(TransactionIpcChannel.STOCK_COUNT_CREATE, async (_event, { payload, userId }) => await stockCountService.create(payload, userId))
registerIpcHandler(TransactionIpcChannel.STOCK_COUNT_UPDATE, async (_event, { id, payload, userId }) => await stockCountService.update(id, payload, userId))
registerIpcHandler(TransactionIpcChannel.STOCK_COUNT_DELETE, async (_event, { id, userId }) => await stockCountService.delete(id, userId))
