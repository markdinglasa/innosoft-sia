import { Error } from '@shared/messages'
import { SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { licenseKey } from '../../../functions'

ipcMain.handle(SqlChannel.getLicenseKey, async (_event: any): Promise<string> => {
  try {
    return await licenseKey()
  } catch (error: any) {
    return Error.e00x02
  }
})
