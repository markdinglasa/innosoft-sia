import { UtilityIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { SysNotificationService } from '../../services/utility.services'

const sysNotificationService = new SysNotificationService()

registerProtectedIpcHandler(UtilityIpcChannel.NOTIFICATION_LIST, async (_event, options) => await sysNotificationService.list(options))
registerProtectedIpcHandler(UtilityIpcChannel.NOTIFICATION_GET, async (_event, id) => await sysNotificationService.get(id))
registerProtectedIpcHandler(UtilityIpcChannel.NOTIFICATION_CREATE, async (_event, { payload, userId }) => await sysNotificationService.create(payload, userId))
registerProtectedIpcHandler(UtilityIpcChannel.NOTIFICATION_UPDATE, async (_event, { id, payload, userId }) => await sysNotificationService.update(id, payload, userId))
registerProtectedIpcHandler(UtilityIpcChannel.NOTIFICATION_DELETE, async (_event, { id, userId }) => await sysNotificationService.delete(id, userId))
