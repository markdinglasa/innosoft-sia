import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { TableService } from '../../services/masterfile.services'

const tableService = new TableService()

registerIpcHandler(MasterfileIpcChannel.TABLE_LIST, async (_event, options) => await tableService.list(options))
registerIpcHandler(MasterfileIpcChannel.TABLE_GET, async (_event, id) => await tableService.get(id))
registerIpcHandler(MasterfileIpcChannel.TABLE_CREATE, async (_event, { payload, userId }) => await tableService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.TABLE_UPDATE, async (_event, { id, payload, userId }) => await tableService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.TABLE_DELETE, async (_event, { id, userId }) => await tableService.delete(id, userId))
