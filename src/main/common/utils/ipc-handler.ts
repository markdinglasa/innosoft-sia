import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { IpcResponseItem } from '@shared/types'
import { AppException } from '../exceptions'
import { verifyToken } from '../utils/jwt.util'
import { SYSTEM_ACCESS_TOKEN } from '@shared/constants'
import Store from '../../store/Store'

export function registerIpcHandler<T>(
  channel: string,
  handler: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<T>
) {
  ipcMain.handle(channel, async (event, ...args): Promise<IpcResponseItem<T>> => {
    try {
      const result = await handler(event, ...args)
      return { success: true, data: result }
    } catch (error: any) {
      if (error instanceof AppException) {
        console.warn(`[IPC WARN] ${channel}:`, error.message)
        return {
          success: false,
          error: {
            message: error.message,
            statusCode: error.statusCode,
            metadata: error.metadata
          }
        }
      }

      console.error(`[IPC ERROR] ${channel}:`, error)
      return {
        success: false,
        error: {
          message: 'Internal Server Error',
          statusCode: 500,
          metadata: error.message || 'Unknown error occurred'
        }
      }
    }
  })
}

/**
 * Registers an IPC handler that requires a valid access token (auth guard).
 * If the token is missing or expired, returns a 401 Unauthorized response.
 */
export function registerProtectedIpcHandler<T>(
  channel: string,
  handler: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<T>
) {
  ipcMain.handle(channel, async (event, ...args): Promise<IpcResponseItem<T>> => {
    try {
      // Auth guard: validate access token
      const accessToken = Store.get(SYSTEM_ACCESS_TOKEN)
      if (!accessToken) {
        return {
          success: false,
          error: {
            message: 'Unauthorized. Please log in.',
            statusCode: 401,
            metadata: 'No access token found'
          }
        }
      }

      try {
        verifyToken(accessToken)
      } catch {
        return {
          success: false,
          error: {
            message: 'Access token expired or invalid. Please log in again.',
            statusCode: 401,
            metadata: 'Token verification failed'
          }
        }
      }

      const result = await handler(event, ...args)
      return { success: true, data: result }
    } catch (error: any) {
      if (error instanceof AppException) {
        console.warn(`[IPC WARN] ${channel}:`, error.message)
        return {
          success: false,
          error: {
            message: error.message,
            statusCode: error.statusCode,
            metadata: error.metadata
          }
        }
      }

      console.error(`[IPC ERROR] ${channel}:`, error)
      return {
        success: false,
        error: {
          message: 'Internal Server Error',
          statusCode: 500,
          metadata: error.message || 'Unknown error occurred'
        }
      }
    }
  })
}

