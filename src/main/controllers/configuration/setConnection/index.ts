import { ERROR, Success } from '@shared/messages'
import { DBConfig, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import Store from 'electron-store'
import { reinitializeDatabase } from '../../../typeORM/configurations'

ipcMain.handle(
  SqlChannel.setConnection,
  async (_event: unknown, config: DBConfig): Promise<Response> => {
    try {
      if (!config) return { IsSomething: false, Message: ERROR.e00x43 }
      const store = new Store()
      store.set(SqlChannel.dbConfig, config)

      // Reinitialize the database connection with the new credentials
      // so that TypeORM immediately picks up the new settings without
      // requiring a full application restart.
      await reinitializeDatabase()

      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: unknown) {
      return { IsSomething: false, Message: (error as Error).message || ERROR.e00x02 }
    }
  }
)
