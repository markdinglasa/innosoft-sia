import { Error, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { recordByQuery } from '../../../model'

ipcMain.handle(SqlChannel.getAmount, async (_event: any, query: string): Promise<Response> => {
  try {
    // Query the database for the sales data
    if (!query || typeof query !== 'string') {
      return { IsSomething: true, Message: Error.e00x31 }
    }
    const response = (await recordByQuery(query))?.List ?? []

    // Return success response
    return { Data: response[0], Message: Success.s00x00 }
  } catch (error: any) {
    // Log and return error response
    console.error('Error writing file:', error)
    return { IsSomething: false, Message: error.message || Error.e00x02 }
  }
})
