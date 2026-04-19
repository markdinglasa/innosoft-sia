import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { DebitCreditMemoService } from '../../services/transaction.services'

const debitCreditMemoService = new DebitCreditMemoService()

registerProtectedIpcHandler(TransactionIpcChannel.DEBIT_CREDIT_MEMO_LIST, async (_event, options) => await debitCreditMemoService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.DEBIT_CREDIT_MEMO_GET, async (_event, id) => await debitCreditMemoService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.DEBIT_CREDIT_MEMO_CREATE, async (_event, { payload, userId }) => await debitCreditMemoService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.DEBIT_CREDIT_MEMO_UPDATE, async (_event, { id, payload, userId }) => await debitCreditMemoService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.DEBIT_CREDIT_MEMO_DELETE, async (_event, { id, userId }) => await debitCreditMemoService.delete(id, userId))
registerProtectedIpcHandler(TransactionIpcChannel.DEBIT_CREDIT_MEMO_PROCESS_ISO, async (_event, { message, userId }) => await debitCreditMemoService.createFromIso8583(message, userId))
