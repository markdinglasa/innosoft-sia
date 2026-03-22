import { AuthIpcChannel } from "@shared/types"
import { BadRequestException } from '../../common/exceptions'
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { AuthService } from '../../services/auth.services'

const authService = new AuthService()

/**
 * Handles 'auth:login' IPC invocations.
 *
 * Incoming shape: args[0] = { userName: string, password: string }
 * Return shape: IpcResponseItem<LoginResponse>
 */
registerIpcHandler(AuthIpcChannel.LOGIN, async (_event, payload) => {
  if (!payload || !payload.username || !payload.password) {
    throw new BadRequestException('Username and Password are required')
  }
  return await authService.login(payload.username, payload.password)
})
