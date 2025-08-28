import { ERROR, Success } from '@shared/messages'
import { DBConfig, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import Store from 'electron-store'

ipcMain.handle(
  SqlChannel.setConnection,
  async (_event: unknown, config: DBConfig): Promise<Response> => {
    try {
      if (!config) return { IsSomething: false, Message: ERROR.e00x43 }
      const store = new Store()
      store.set(SqlChannel.dbConfig, config)
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: unknown) {
      return { IsSomething: false, Message: (error as Error).message || ERROR.e00x02 }
    }
  }
)
