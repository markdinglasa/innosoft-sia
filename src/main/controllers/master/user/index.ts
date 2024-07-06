import { Error, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { recordsByTable } from '../../../model'

ipcMain.handle(SqlChannel.getAllUser, async (_event: any): Promise<Response> => {
  try {
    const result: Response = await recordsByTable('MstUser')
    if (!result.List) return { List: null, Message: result.Message }
    return { List: result.List, Message: Success.s00x00 }
  } catch (error: any) {
    return { List: null, Message: Error.e00x02 }
  }
})
