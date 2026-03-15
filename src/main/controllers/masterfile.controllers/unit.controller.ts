import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { UnitService } from '../../services/masterfile.services'

const unitService = new UnitService()

registerProtectedIpcHandler(MasterfileIpcChannel.UNIT_LIST, async (_event, options) => await unitService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.UNIT_GET, async (_event, id) => await unitService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.UNIT_CREATE, async (_event, { payload, userId }) => await unitService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.UNIT_UPDATE, async (_event, { id, payload, userId }) => await unitService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.UNIT_DELETE, async (_event, { id, userId }) => await unitService.delete(id, userId))
