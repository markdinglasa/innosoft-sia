import { ERROR, Success } from '@shared/messages'
import { QueryFn } from '@shared/query'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { createFolder } from '../../../functions'
import { executeQuery, recordByQuery } from '../../../model'

ipcMain.handle(SqlChannel.checkFields, async (_event: unknown, path: string): Promise<Response> => {
  try {
    if (!path) return { IsSomething: false, Message: ERROR.e00x45 }
    let validateField: Response, validatePax: Response, response: Response
    const folderName: string = 'SIA'
    try {
      validateField = await recordByQuery(QueryFn.q00x002)
      if (!validateField.List) {
        response = await executeQuery(QueryFn.q00x003)
        console.log(response)
      }
    } catch (error: unknown) {
      response = await executeQuery(QueryFn.q00x003)
      // console.log(response)
    }
    try {
      validatePax = await recordByQuery(QueryFn.q00x004)
      if (!validatePax.List) {
        response = await executeQuery(QueryFn.q00x005)
        response = await executeQuery(QueryFn.q00x006)
        // console.log(response)
      }
    } catch (error: unknown) {
      response = await executeQuery(QueryFn.q00x005)
      // response = await executeQuery(QueryFn.q00x006)
      console.log(response)
    }
    const cf: Response = createFolder(`${path}/${folderName}`)
    if (!cf.IsSomething) return { IsSomething: false, Message: cf.Message }
    return { IsSomething: true, Message: Success.s00x00 }
  } catch (error: unknown) {
    return { IsSomething: false, Message: (error as Error).message || ERROR.e00x02 }
  }
})
