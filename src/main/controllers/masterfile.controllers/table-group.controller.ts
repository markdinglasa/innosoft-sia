import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { TableGroupService } from '../../services/masterfile.services'

const tableGroupService = new TableGroupService()

registerIpcHandler(MasterfileIpcChannel.TABLE_GROUP_LIST, async (_event, options) => await tableGroupService.list(options))
registerIpcHandler(MasterfileIpcChannel.TABLE_GROUP_GET, async (_event, id) => await tableGroupService.get(id))
registerIpcHandler(MasterfileIpcChannel.TABLE_GROUP_CREATE, async (_event, { payload, userId }) => await tableGroupService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.TABLE_GROUP_UPDATE, async (_event, { id, payload, userId }) => await tableGroupService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.TABLE_GROUP_DELETE, async (_event, { id, userId }) => await tableGroupService.delete(id, userId))
