import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { JournalService } from '../../services/transaction.services'

const journalService = new JournalService()

registerProtectedIpcHandler(TransactionIpcChannel.JOURNAL_LIST, async (_event, options) => await journalService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.JOURNAL_GET, async (_event, id) => await journalService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.JOURNAL_CREATE, async (_event, { payload, userId }) => await journalService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.JOURNAL_UPDATE, async (_event, { id, payload, userId }) => await journalService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.JOURNAL_DELETE, async (_event, { id, userId }) => await journalService.delete(id, userId))
