import { SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'

ipcMain.handle(
  SqlChannel.getAllAccounts,
  async (_event: any, table: string): Promise<Array<any>> => {
    try {
      return [table]
    } catch (error: any) {
      console.log('Failed to get accounts', error)
      throw error
    }
  }
)
