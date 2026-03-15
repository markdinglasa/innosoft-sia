import { UtilityIpcChannel } from '@shared/types'
import { registerProtectedIpcHandler } from '../../common/utils/ipc-handler'
import { SysMailerService } from '../../services/utility.services'

const sysMailerService = new SysMailerService()

// Mailer IPC
registerProtectedIpcHandler(UtilityIpcChannel.MAILER_SEND, async (_event, { to, subject, html }) => {
  return await sysMailerService.sendEmail({ to, subject, html })
})
