import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { RoleService } from '../../services/masterfile.services'

const roleService = new RoleService()

registerProtectedIpcHandler(MasterfileIpcChannel.ROLE_LIST, async (_event, options) => await roleService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.ROLE_GET, async (_event, id) => await roleService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.ROLE_CREATE, async (_event, { payload, userId }) => await roleService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.ROLE_UPDATE, async (_event, { id, payload, userId }) => await roleService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.ROLE_DELETE, async (_event, { id, userId }) => await roleService.delete(id, userId))
