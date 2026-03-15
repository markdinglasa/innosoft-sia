import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { SysMailerService } from '../../services/utility.services'

const sysMailerService = new SysMailerService()

// Mailer IPC
registerIpcHandler('utility:mailer:send', async (_event, payload) => await sysMailerService.sendEmail(payload))
