import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { PaxTableService } from '../../services/transaction.services'

const paxTableService = new PaxTableService()

registerProtectedIpcHandler(TransactionIpcChannel.PAX_TABLE_LIST, async (_event, options) => await paxTableService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.PAX_TABLE_GET, async (_event, id) => await paxTableService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.PAX_TABLE_CREATE, async (_event, { payload, userId }) => await paxTableService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.PAX_TABLE_UPDATE, async (_event, { id, payload, userId }) => await paxTableService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.PAX_TABLE_DELETE, async (_event, { id, userId }) => await paxTableService.delete(id, userId))
