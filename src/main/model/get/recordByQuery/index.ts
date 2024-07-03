import { Error, Success } from '@shared/messages'
import { Response } from '@shared/types'
import { Connection } from '../../../functions'

/**
 * Retrieves records from given query
 * @param {string} Query
 * @returns {Promise<Array>}
*/

export const recordByQuery = async (Query: string = ''): Promise<Response> => {
    try {
        if (!Query || typeof Query !== 'string') return ({Data: null, Message: Error.e00x31})
        const pool:any = (await Connection()).pool;
        if (!pool) return ({Data: null, Message: Error.e00x14})
        pool.setMaxListeners(15);
        const result = await  pool.request().query(Query);
        if (!result.recordset || result.recordset.length < 1) return ({Data: null, Message: Error.e00x30})
        return ({Data: result.recordset, Message: Success.s00x00})
    } catch (error:any) {
        return ({Data: null, Message: Error.e00x02})
    } 
}