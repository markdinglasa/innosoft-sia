import { Error, Success } from '@shared/messages'
import { Int } from 'mssql'
import { Connection } from '../../../functions'

interface Response {
  Data: Array<any> | null
  Message: string
}

/**
 * Retrieves 1 specific record from a given Id & Table.
 * @param {number} Id
 * @param {string} Table
 * @returns {Promise<Array>}
 */
export const recordById = async (Id: number = 0, Table: string = ''): Promise<Response> => {
  try {
    if (isNaN(Id) || typeof Id !== 'number') return { Data: null, Message: Error.e00x07 }

    if (!Table || typeof Table !== 'string') return { Data: null, Message: Error.e00x28 }
    if (Id < 1) return { Data: null, Message: Error.e00x29 }
    const pool: any = (await Connection()).pool
    if (!pool) return { Data: null, Message: Error.e00x14 }
    const request = pool.request()
    request.input('Id', Int, Id)
    const result = await request.query(`SELECT * FROM [${Table}] WHERE [Id] = @Id`)
    if (!result.recordset || result.recordset.length < 1)
      return { Data: null, Message: Error.e00x30 }
    return { Data: result.recordset[0], Message: Success.s00x00 }
  } catch (error: any) {
    return { Data: null, Message: Error.e00x02 }
  }
}
