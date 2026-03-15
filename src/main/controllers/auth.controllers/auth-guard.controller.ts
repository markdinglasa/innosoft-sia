import { registerIpcHandler } from '../../common/utils/ipc-handler'
import { AuthService } from '../../services/auth.services'

const authService = new AuthService()

/**
 * Handles 'auth:validate-token' IPC invocations (Auth Guard).
 * Verifies the current access token and returns the decoded payload.
 */
registerIpcHandler('auth:validate-token', async () => {
  const payload = await authService.validateAccessToken()
  return payload
})
