import { UtilityIpcChannel } from '@shared/types'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { SysSettingsService } from '../../services/utility.services'

const sysSettingsService = new SysSettingsService()

registerIpcHandler(UtilityIpcChannel.SETTINGS_GET, async (_event, id) => await sysSettingsService.get(id))
registerIpcHandler(UtilityIpcChannel.SETTINGS_UPDATE, async (_event, { id, payload, userId }) => await sysSettingsService.update(id, payload, userId))
