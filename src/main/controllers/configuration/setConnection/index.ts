import { Error, Success } from '@shared/messages'
import { DBConfig, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import Store from 'electron-store'
import { Production } from '../../../../../production'
ipcMain.handle(
  SqlChannel.setConnection,
  async (_event: any, config: DBConfig): Promise<Response> => {
    try {
      if (!config) return { IsSomething: false, Message: Error.e00x43 }
      const store = new Store()
      store.set(`${SqlChannel.dbConfig}${Production.env}`, config)
      return { IsSomething: true, Message: Success.s00x00 }
    } catch (error: any) {
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
