import { IpcMainInvokeEvent, ipcMain } from 'electron'
import { IpcResponseItem } from '@shared/types'
import { AppException } from '../exceptions'

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
