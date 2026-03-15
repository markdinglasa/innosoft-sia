import { TransactionIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { CollectionService } from '../../services/transaction.services'

const collectionService = new CollectionService()

registerProtectedIpcHandler(TransactionIpcChannel.COLLECTION_LIST, async (_event, options) => await collectionService.list(options))
registerProtectedIpcHandler(TransactionIpcChannel.COLLECTION_GET, async (_event, id) => await collectionService.get(id))
registerProtectedIpcHandler(TransactionIpcChannel.COLLECTION_CREATE, async (_event, { payload, userId }) => await collectionService.create(payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.COLLECTION_UPDATE, async (_event, { id, payload, userId }) => await collectionService.update(id, payload, userId))
registerProtectedIpcHandler(TransactionIpcChannel.COLLECTION_DELETE, async (_event, { id, userId }) => await collectionService.delete(id, userId))
