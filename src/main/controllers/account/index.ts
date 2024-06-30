import { SqlChannel } from '@shared/types/sql'
import { ipcMain } from 'electron'
import { getDataByTable } from '../../functions'

ipcMain.handle(
  SqlChannel.getAllAccounts,
  async (_event: any, table: string): Promise<Array<any>> => {
    try {
      return await getDataByTable(table)
    } catch (error: any) {
      console.log('Failed to get accounts', error)
      throw error
    }
  }
)
