import { Error, Success } from '../../../../shared/messages'
import { Response } from '../../../../shared/types'
import { Connection } from '../../../functions'

/**
 * Retrieves specific record from a given fields.
 * @param {string}  Query
 * @param {Array}   Field
 * @param {Array}   Type
 * @param {Array}   Data
 * @returns {Promise<Array>}
 */

export const recordByFields = async (
  Query: string = '',
  Field: Array<any> = [],
  Type: Array<any> = [],
  Data: Array<any> = []
): Promise<Response> => {
  try {
    if (!Query || typeof Query !== 'string') return { Data: null, Message: Error.e00x31 }
    if (!Field.every((field) => field !== undefined)) return { Data: null, Message: Error.e00x32 }
    if (!Type.every((field: undefined) => field !== undefined))
      return { Data: null, Message: Error.e00x33 }
    if (!Data.every((field) => field !== undefined)) return { Data: null, Message: Error.e00x34 }
    if (Field.length !== Data.length || Field.length !== Type.length)
      return { Data: null, Message: Error.e00x35 }
    const pool: any = (await Connection()).pool
    if (!pool) return { Data: null, Message: Error.e00x14 }
    pool.setMaxListeners(15)
    const request = pool.request()
    for (let i = 0; i < Field.length; i++) {
      if (Data[i] === undefined) return { Data: null, Message: Error.e00x35 }
      request.input(Field[i], Type[i], Data[i])
    }
    const result = await request.query(Query)
    if (!result.recordset || result.recordset.length < 1)
      return { Data: null, Message: Error.e00x30 }
    return { Data: result.recordset, Message: Success.s00x00 }
  } catch (error: any) {
    return { Data: null, Message: Error.e00x02 }
  }
}
