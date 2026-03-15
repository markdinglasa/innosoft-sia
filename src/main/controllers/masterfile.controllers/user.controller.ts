import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { UserService } from '../../services/masterfile.services'

const userService = new UserService()

registerProtectedIpcHandler(MasterfileIpcChannel.USER_LIST, async (_event, options) => await userService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.USER_GET, async (_event, id) => await userService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.USER_CREATE, async (_event, { payload, userId }) => await userService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.USER_UPDATE, async (_event, { id, payload, userId }) => await userService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.USER_DELETE, async (_event, { id, userId }) => await userService.delete(id, userId))
