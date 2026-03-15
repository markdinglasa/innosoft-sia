import { MasterfileIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { PermissionService } from '../../services/masterfile.services'

const permissionService = new PermissionService()

registerProtectedIpcHandler(MasterfileIpcChannel.PERMISSION_LIST, async (_event, options) => await permissionService.list(options))
registerProtectedIpcHandler(MasterfileIpcChannel.PERMISSION_GET, async (_event, id) => await permissionService.get(id))
registerProtectedIpcHandler(MasterfileIpcChannel.PERMISSION_CREATE, async (_event, { payload, userId }) => await permissionService.create(payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.PERMISSION_UPDATE, async (_event, { id, payload, userId }) => await permissionService.update(id, payload, userId))
registerProtectedIpcHandler(MasterfileIpcChannel.PERMISSION_DELETE, async (_event, { id, userId }) => await permissionService.delete(id, userId))
