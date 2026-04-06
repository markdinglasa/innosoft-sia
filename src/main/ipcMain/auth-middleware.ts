import { AuthService } from '../services/auth.services/auth.service'

const authService = new AuthService()

/**
 * Higher-order function to wrap IPC handlers with a token validation check.
 * If the token is invalid or expired, it returns a failure response.
 */
export function withAuth<T>(handler: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<T>) {
  return async (event: Electron.IpcMainInvokeEvent, ...args: any[]) => {
    try {
      // Validate the stored access token
      await authService.validateAccessToken()
      
      // If valid, proceed to the requested handler
      return await handler(event, ...args)
    } catch (error: any) {
      console.error('[AuthMiddleware] Unauthorized access attempt:', error.message)
      return { 
        success: false, 
        message: error.message || 'Unauthorized: Session expired or invalid.',
        isUnauthorized: true // Helper flag for the renderer
      }
    }
  }
}
