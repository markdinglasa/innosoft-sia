import { UtilityIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { SysAuditTrailService } from '../../services/utility.services'

const sysAuditTrailService = new SysAuditTrailService()

registerIpcHandler(UtilityIpcChannel.AUDIT_TRAIL_LIST, async (_event, options) => await sysAuditTrailService.list(options))
registerIpcHandler(UtilityIpcChannel.AUDIT_TRAIL_GET, async (_event, id) => await sysAuditTrailService.get(id))
