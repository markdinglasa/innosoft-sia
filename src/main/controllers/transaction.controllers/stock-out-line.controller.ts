import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { StockOutLineService } from '../../services/transaction.services'

const stockOutLineService = new StockOutLineService()

registerProtectedIpcHandler(TransactionIpcChannel.STOCK_OUT_LINE_LIST, async (_event, options) => await stockOutLineService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_OUT_LINE_GET, async (_event, id) => await stockOutLineService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_OUT_LINE_CREATE, async (_event, { payload, userId }) => await stockOutLineService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_OUT_LINE_UPDATE, async (_event, { id, payload, userId }) => await stockOutLineService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.STOCK_OUT_LINE_DELETE, async (_event, { id, userId }) => await stockOutLineService.delete(id, userId))
