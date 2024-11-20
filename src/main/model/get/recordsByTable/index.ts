import { Error, Success } from '../../../../shared/messages'
import { Response } from '../../../../shared/types'
import { Connection } from '../../../functions'

/**
 * Retrieves all records from a given Table.
 * @param {string} Table
 * @returns {Promise<Array>}
 */

export const recordsByTable = async (Table: string = ''): Promise<Response> => {
  try {
    if (typeof Table !== 'string' || !Table) return { List: [], Message: Error.e00x28 }
    const pool = (await Connection()).pool
    if (!pool) return { List: [], Message: Error.e00x14 }
    const request = pool.request()
    const result = await request.query(`SELECT * FROM [${Table}]`)
    if (!result.recordset || result.recordset.length < 1) return { List: [], Message: Error.e00x30 }
    return { List: result.recordset, Message: Success.s00x00 }
  } catch (error: any) {
    return { List: [], Message: Error.e00x02 }
  }
}
