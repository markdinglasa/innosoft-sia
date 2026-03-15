import { TransactionIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { JournalService } from '../../services/transaction.services'

const journalService = new JournalService()

registerIpcHandler(TransactionIpcChannel.JOURNAL_LIST, async (_event, options) => await journalService.list(options))
registerIpcHandler(TransactionIpcChannel.JOURNAL_GET, async (_event, id) => await journalService.get(id))
registerIpcHandler(TransactionIpcChannel.JOURNAL_CREATE, async (_event, { payload, userId }) => await journalService.create(payload, userId))
registerIpcHandler(TransactionIpcChannel.JOURNAL_UPDATE, async (_event, { id, payload, userId }) => await journalService.update(id, payload, userId))
registerIpcHandler(TransactionIpcChannel.JOURNAL_DELETE, async (_event, { id, userId }) => await journalService.delete(id, userId))
