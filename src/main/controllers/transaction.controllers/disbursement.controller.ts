import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { DisbursementService } from '../../services/transaction.services'

const disbursementService = new DisbursementService()

registerProtectedIpcHandler(TransactionIpcChannel.DISBURSEMENT_LIST, async (_event, options) => await disbursementService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.DISBURSEMENT_GET, async (_event, id) => await disbursementService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.DISBURSEMENT_CREATE, async (_event, { payload, userId }) => await disbursementService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.DISBURSEMENT_UPDATE, async (_event, { id, payload, userId }) => await disbursementService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.DISBURSEMENT_DELETE, async (_event, { id, userId }) => await disbursementService.delete(id, userId))
