import { TransactionIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { StockOutService } from '../../services/transaction.services'

const stockOutService = new StockOutService()

registerIpcHandler(TransactionIpcChannel.STOCK_OUT_LIST, async (_event, options) => await stockOutService.list(options))
registerIpcHandler(TransactionIpcChannel.STOCK_OUT_GET, async (_event, id) => await stockOutService.get(id))
registerIpcHandler(TransactionIpcChannel.STOCK_OUT_CREATE, async (_event, { payload, userId }) => await stockOutService.create(payload, userId))
registerIpcHandler(TransactionIpcChannel.STOCK_OUT_UPDATE, async (_event, { id, payload, userId }) => await stockOutService.update(id, payload, userId))
registerIpcHandler(TransactionIpcChannel.STOCK_OUT_DELETE, async (_event, { id, userId }) => await stockOutService.delete(id, userId))
