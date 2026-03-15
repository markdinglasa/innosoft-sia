import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { UserService } from '../../services/masterfile.services'

const userService = new UserService()

registerIpcHandler(MasterfileIpcChannel.USER_LIST, async (_event, options) => await userService.list(options))
registerIpcHandler(MasterfileIpcChannel.USER_GET, async (_event, id) => await userService.get(id))
registerIpcHandler(MasterfileIpcChannel.USER_CREATE, async (_event, { payload, userId }) => await userService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.USER_UPDATE, async (_event, { id, payload, userId }) => await userService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.USER_DELETE, async (_event, { id, userId }) => await userService.delete(id, userId))
