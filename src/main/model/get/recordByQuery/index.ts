import { Error, Success } from '../../../../shared/messages'
import { Response } from '../../../../shared/types'
import { Connection } from '../../../functions'

/**
 * Retrieves records from given query
 * @param {string} Query
 * @returns {Promise<Array>}
 */

export const recordByQuery = async (Query: string = ''): Promise<Response> => {
  try {
    if (!Query || typeof Query !== 'string') return { List: [], Message: Error.e00x31 }

    const pool: any = (await Connection()).pool
    if (!pool) return { List: [], Message: Error.e00x14 }

    pool.setMaxListeners(15)

    // Create a request and set a longer timeout (e.g., 30000ms)
    const request = pool.request()
    request.timeout = 30000 // 30 seconds

    const result = await request.query(Query)
    if (!result.recordset || result.recordset.length < 1) return { List: [], Message: Error.e00x30 }

    return { List: result.recordset, Message: Success.s00x00 }
  } catch (error: any) {
    return { List: [], Message: error.message || Error.e00x02 }
  }
}
