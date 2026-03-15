import { TransactionIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { StockOutLineService } from '../../services/transaction.services'

const stockOutLineService = new StockOutLineService()

registerIpcHandler(TransactionIpcChannel.STOCK_OUT_LINE_LIST, async (_event, options) => await stockOutLineService.list(options))
registerIpcHandler(TransactionIpcChannel.STOCK_OUT_LINE_GET, async (_event, id) => await stockOutLineService.get(id))
registerIpcHandler(TransactionIpcChannel.STOCK_OUT_LINE_CREATE, async (_event, { payload, userId }) => await stockOutLineService.create(payload, userId))
registerIpcHandler(TransactionIpcChannel.STOCK_OUT_LINE_UPDATE, async (_event, { id, payload, userId }) => await stockOutLineService.update(id, payload, userId))
registerIpcHandler(TransactionIpcChannel.STOCK_OUT_LINE_DELETE, async (_event, { id, userId }) => await stockOutLineService.delete(id, userId))
