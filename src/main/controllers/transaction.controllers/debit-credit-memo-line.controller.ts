import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { DebitCreditMemoLineService } from '../../services/transaction.services'

const debitCreditMemoLineService = new DebitCreditMemoLineService()

registerProtectedIpcHandler(TransactionIpcChannel.DEBIT_CREDIT_MEMO_LINE_LIST, async (_event, options) => await debitCreditMemoLineService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.DEBIT_CREDIT_MEMO_LINE_GET, async (_event, id) => await debitCreditMemoLineService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.DEBIT_CREDIT_MEMO_LINE_CREATE, async (_event, { payload, userId }) => await debitCreditMemoLineService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.DEBIT_CREDIT_MEMO_LINE_UPDATE, async (_event, { id, payload, userId }) => await debitCreditMemoLineService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.DEBIT_CREDIT_MEMO_LINE_DELETE, async (_event, { id, userId }) => await debitCreditMemoLineService.delete(id, userId))
