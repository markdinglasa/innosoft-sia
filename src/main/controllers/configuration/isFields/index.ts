import { Error, Success } from '@shared/messages'
import { QueryFn } from '@shared/query'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { createFolder } from '../../../functions'
import { executeQuery, recordByQuery } from '../../../model'

ipcMain.handle(SqlChannel.checkFields, async (_event: any, path: string): Promise<Response> => {
  try {
    if (!path) return { IsSomething: false, Message: Error.e00x45 }
    let validateField: Response,
      validatePax: Response,
      response: Response,
      folderName: string = 'SIA'
    try {
      validateField = await recordByQuery(QueryFn.q00x002)
      if (!validateField.List) {
        response = await executeQuery(QueryFn.q00x003)
        console.log(response)
      }
    } catch (error: any) {
      response = await executeQuery(QueryFn.q00x003)
      console.log(response)
    }
    try {
      validatePax = await recordByQuery(QueryFn.q00x004)
      if (!validatePax.List) {
        response = await executeQuery(QueryFn.q00x005)
        console.log(response)
      }
    } catch (error: any) {
      response = await executeQuery(QueryFn.q00x005)
      console.log(response)
    }
    const cf: Response = createFolder(`${path}/${folderName}`)
    if (!cf.IsSomething) return { IsSomething: false, Message: cf.Message }
    return { IsSomething: true, Message: Success.s00x00 }
  } catch (error: any) {
    return { IsSomething: false, Message: Error.e00x02 }
  }
})
