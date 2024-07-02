import { SqlChannel } from '@shared/types/sql'
import { ipcMain } from 'electron'
import { Connection } from '../../../functions'

ipcMain.handle(SqlChannel.isConnected, async (_event: any): Promise<boolean> => {
  try {
    const result = await Connection()
    if (!result.isConnected) return false
    return true
  } catch (error: any) {
    return false
  }
})
