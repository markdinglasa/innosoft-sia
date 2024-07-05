import { Error, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { recordsByTable } from '../../../model'

ipcMain.handle(SqlChannel.getAllAccounts, async (_event: any, table: string): Promise<Response> => {
  try {
    const result: Response = await recordsByTable(table)
    if (!result.List) return { List: null, Message: result.Message }
    return { List: result.List, Message: Success.s00x00 }
  } catch (error: any) {
    return { List: null, Message: Error.e00x02 }
  }
})
