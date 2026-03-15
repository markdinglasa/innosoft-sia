import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { UnitService } from '../../services/masterfile.services'

const unitService = new UnitService()

registerIpcHandler(MasterfileIpcChannel.UNIT_LIST, async (_event, options) => await unitService.list(options))
registerIpcHandler(MasterfileIpcChannel.UNIT_GET, async (_event, id) => await unitService.get(id))
registerIpcHandler(MasterfileIpcChannel.UNIT_CREATE, async (_event, { payload, userId }) => await unitService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.UNIT_UPDATE, async (_event, { id, payload, userId }) => await unitService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.UNIT_DELETE, async (_event, { id, userId }) => await unitService.delete(id, userId))
