import { UtilityIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { SysAuditTrailService } from '../../services/utility.services'

const sysAuditTrailService = new SysAuditTrailService()

registerProtectedIpcHandler(UtilityIpcChannel.AUDIT_TRAIL_LIST, async (_event, options) => await sysAuditTrailService.list(options))
registerProtectedIpcHandler(UtilityIpcChannel.AUDIT_TRAIL_GET, async (_event, id) => await sysAuditTrailService.get(id))
