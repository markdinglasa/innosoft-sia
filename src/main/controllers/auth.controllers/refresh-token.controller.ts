import { AuthIpcChannel } from "@shared/types"
import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { AuthService } from '../../services/auth.services'

const authService = new AuthService()

/**
 * Handles 'auth:refresh-token' IPC invocations.
 * Verifies the stored refresh token and issues a new token pair.
 */
registerIpcHandler(AuthIpcChannel.REFRESH_TOKEN, async () => {
  const result = await authService.refreshTokens()
  return result
})
