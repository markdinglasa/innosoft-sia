import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { PayTypeService } from '../../services/masterfile.services'

const payTypeService = new PayTypeService()

registerIpcHandler(MasterfileIpcChannel.PAY_TYPE_LIST, async (_event, options) => await payTypeService.list(options))
registerIpcHandler(MasterfileIpcChannel.PAY_TYPE_GET, async (_event, id) => await payTypeService.get(id))
registerIpcHandler(MasterfileIpcChannel.PAY_TYPE_CREATE, async (_event, { payload, userId }) => await payTypeService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.PAY_TYPE_UPDATE, async (_event, { id, payload, userId }) => await payTypeService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.PAY_TYPE_DELETE, async (_event, { id, userId }) => await payTypeService.delete(id, userId))
