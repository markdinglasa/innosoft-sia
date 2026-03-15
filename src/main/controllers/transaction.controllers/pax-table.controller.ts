import { TransactionIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { PaxTableService } from '../../services/transaction.services'

const paxTableService = new PaxTableService()

registerIpcHandler(TransactionIpcChannel.PAX_TABLE_LIST, async (_event, options) => await paxTableService.list(options))
registerIpcHandler(TransactionIpcChannel.PAX_TABLE_GET, async (_event, id) => await paxTableService.get(id))
registerIpcHandler(TransactionIpcChannel.PAX_TABLE_CREATE, async (_event, { payload, userId }) => await paxTableService.create(payload, userId))
registerIpcHandler(TransactionIpcChannel.PAX_TABLE_UPDATE, async (_event, { id, payload, userId }) => await paxTableService.update(id, payload, userId))
registerIpcHandler(TransactionIpcChannel.PAX_TABLE_DELETE, async (_event, { id, userId }) => await paxTableService.delete(id, userId))
