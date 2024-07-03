import { Error, Success } from '@shared/messages'
import { Int } from 'mssql'
import { Connection } from '../../../functions'

interface Response {
  Data: Array<any> | null
  Message: string
}

/**
 * Retrieves records from a given Id & Query.
 * @param {number} Id
 * @param {string} Query
 * @returns {Promise<Array>}
 */
export const recordByIdAndQuery = async (Id: number = 0, Query: string = ''): Promise<Response> => {
  try {
    if (isNaN(Id) || typeof Id !== 'number') return ({Data: null , Message: Error.e00x07})
    if (!Query || typeof Query !== 'string') return ({Data: null, Message: Error.e00x31})
    if (Id < 1) return ({ Data: null, Message:Error.e00x29 })
    const pool: any = (await Connection()).pool
    if (!pool) return ({ Data: null, Message: Error.e00x14 })
    pool.setMaxListeners(15)
    const request = pool.request()
    request.input('Id', Int, Id)
    const result = await request.query(Query)
    if (!result.recordset || result.recordset.length < 1) return ({ Data: null, Message: Error.e00x30})
    return  ({Data:result.recordset, Message: Success.s00x00})
  } catch (error) {
    return ({Data: null, Message: Error.e00x02})
  }
}
