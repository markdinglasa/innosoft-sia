import { MasterfileIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { RoleService } from '../../services/masterfile.services'

const roleService = new RoleService()

registerIpcHandler(MasterfileIpcChannel.ROLE_LIST, async (_event, options) => await roleService.list(options))
registerIpcHandler(MasterfileIpcChannel.ROLE_GET, async (_event, id) => await roleService.get(id))
registerIpcHandler(MasterfileIpcChannel.ROLE_CREATE, async (_event, { payload, userId }) => await roleService.create(payload, userId))
registerIpcHandler(MasterfileIpcChannel.ROLE_UPDATE, async (_event, { id, payload, userId }) => await roleService.update(id, payload, userId))
registerIpcHandler(MasterfileIpcChannel.ROLE_DELETE, async (_event, { id, userId }) => await roleService.delete(id, userId))
