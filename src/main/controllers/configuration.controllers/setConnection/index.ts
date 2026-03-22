import { ERROR, Success } from '@shared/messages'
import { DBConfig, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { databaseService } from '../../../services/database.service'

ipcMain.handle(
  SqlChannel.saveConnection,
  async (_event: unknown, config: DBConfig): Promise<Response> => {
    try {
      if (!config) return { IsSomething: false, Message: ERROR.e00x43 }
      
      const result = await databaseService.saveConnection(config)
      if (result.success) {
        return { IsSomething: true, Message: Success.s00x00 }
      } else {
        return { IsSomething: false, Message: result.message }
      }
    } catch (error: unknown) {
      return { IsSomething: false, Message: (error as Error).message || ERROR.e00x02 }
    }
  }
)

ipcMain.handle(
  SqlChannel.getConnections,
  async (): Promise<Response> => {
    try {
      const connections = databaseService.getConnections()
      return { IsSomething: true, Data: connections, Message: Success.s00x00 }
    } catch (error: unknown) {
      return { IsSomething: false, Message: (error as Error).message || ERROR.e00x02 }
    }
  }
)

ipcMain.handle(
  SqlChannel.testConnection,
  async (_event: unknown, config: DBConfig): Promise<Response> => {
    try {
      if (!config) return { IsSomething: false, Message: ERROR.e00x43 }
      const result = await databaseService.testConnection(config)
      return { IsSomething: result.success, Message: result.message }
    } catch (error: unknown) {
      return { IsSomething: false, Message: (error as Error).message || ERROR.e00x02 }
    }
  }
)

ipcMain.handle(
  SqlChannel.activateConnection,
  async (_event: unknown, id: string): Promise<Response> => {
    try {
      if (!id) return { IsSomething: false, Message: 'ID is required' }
      const result = await databaseService.activateConnection(id)
      return { IsSomething: result.success, Message: result.message }
    } catch (error: unknown) {
      return { IsSomething: false, Message: (error as Error).message || ERROR.e00x02 }
    }
  }
)

ipcMain.handle(
  SqlChannel.deleteConnection,
  async (_event: unknown, id: string): Promise<Response> => {
    try {
      if (!id) return { IsSomething: false, Message: 'ID is required' }
      const result = await databaseService.deleteConnection(id)
      return { IsSomething: result.success, Message: result.message }
    } catch (error: unknown) {
      return { IsSomething: false, Message: (error as Error).message || ERROR.e00x02 }
    }
  }
)
