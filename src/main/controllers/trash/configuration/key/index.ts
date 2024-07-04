import { SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { licenseKey } from '../../../functions'

ipcMain.handle(SqlChannel.getKey, async (_event: any): Promise<string> => {
  try {
    const key = await licenseKey()
    return key
  } catch (error: any) {
    return `Internal Server Error: ${error}`
  }
})
