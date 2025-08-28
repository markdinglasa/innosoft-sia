import { ERROR } from '@shared/messages'
import { SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { licenseKey } from '../../../functions'

ipcMain.handle(SqlChannel.getLicenseKey, async (_event: unknown): Promise<string> => {
  try {
    return await licenseKey()
  } catch (error: unknown) {
    return (error as Error).message || ERROR.e00x02
  }
})
