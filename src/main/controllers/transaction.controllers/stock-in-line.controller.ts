import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { StockInLineService } from '../../services/transaction.services'

const stockInLineService = new StockInLineService()

registerProtectedIpcHandler(TransactionIpcChannel.STOCK_IN_LINE_LIST, async (_event, options) => await stockInLineService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_IN_LINE_GET, async (_event, id) => await stockInLineService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_IN_LINE_CREATE, async (_event, { payload, userId }) => await stockInLineService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_IN_LINE_UPDATE, async (_event, { id, payload, userId }) => await stockInLineService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_IN_LINE_DELETE, async (_event, { id, userId }) => await stockInLineService.delete(id, userId))
