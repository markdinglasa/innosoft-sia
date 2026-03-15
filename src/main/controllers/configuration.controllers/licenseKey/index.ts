import { ERROR } from '@shared/messages'
import { SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { licenseKey } from '../../../functions'

ipcMain.handle(SqlChannel.getLicenseKey, async (_event: unknown): Promise<string> => {
  try {
    const response = await licenseKey()
    return response
  } catch (error: unknown) {
    console.log('error', error)
    return (error as Error).message || ERROR.e00x02
  }
})
