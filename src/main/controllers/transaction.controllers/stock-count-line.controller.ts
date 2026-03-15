import { TransactionIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { StockCountLineService } from '../../services/transaction.services'

const stockCountLineService = new StockCountLineService()

registerIpcHandler(TransactionIpcChannel.STOCK_COUNT_LINE_LIST, async (_event, options) => await stockCountLineService.list(options))
registerIpcHandler(TransactionIpcChannel.STOCK_COUNT_LINE_GET, async (_event, id) => await stockCountLineService.get(id))
registerIpcHandler(TransactionIpcChannel.STOCK_COUNT_LINE_CREATE, async (_event, { payload, userId }) => await stockCountLineService.create(payload, userId))
registerIpcHandler(TransactionIpcChannel.STOCK_COUNT_LINE_UPDATE, async (_event, { id, payload, userId }) => await stockCountLineService.update(id, payload, userId))
registerIpcHandler(TransactionIpcChannel.STOCK_COUNT_LINE_DELETE, async (_event, { id, userId }) => await stockCountLineService.delete(id, userId))
