import { AuthIpcChannel } from "@shared/types"
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { AuthService } from '../../services/auth.services'

const authService = new AuthService()

/**
 * Handles 'auth:logout' IPC invocations.
 * Clears tokens and user session from electron-store.
 */
registerIpcHandler(AuthIpcChannel.LOGOUT, async () => {
  await authService.logout()
  return { success: true, message: 'Logged out successfully' }
})
