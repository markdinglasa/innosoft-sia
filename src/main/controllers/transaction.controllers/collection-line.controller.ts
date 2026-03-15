import { TransactionIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { CollectionLineService } from '../../services/transaction.services'

const collectionLineService = new CollectionLineService()

registerIpcHandler(TransactionIpcChannel.COLLECTION_LINE_LIST, async (_event, options) => await collectionLineService.list(options))
registerIpcHandler(TransactionIpcChannel.COLLECTION_LINE_GET, async (_event, id) => await collectionLineService.get(id))
registerIpcHandler(TransactionIpcChannel.COLLECTION_LINE_CREATE, async (_event, { payload, userId }) => await collectionLineService.create(payload, userId))
registerIpcHandler(TransactionIpcChannel.COLLECTION_LINE_UPDATE, async (_event, { id, payload, userId }) => await collectionLineService.update(id, payload, userId))
registerIpcHandler(TransactionIpcChannel.COLLECTION_LINE_DELETE, async (_event, { id, userId }) => await collectionLineService.delete(id, userId))
