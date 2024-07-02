
import { Connection as conn } from '../../../config/database';
import storage from 'node-persist';
import { CONFIG } from '../../../shared';
/**
 * Retrieves records from given query
 * @param {string} Query
 * @returns {Promise<Array>}
*/
export const recordByQuery = async (Query: string = ''): Promise<Array<any>> => {
    try {
        const config = await storage.getItem(CONFIG);
        if (!Query || typeof Query !== 'string') return Promise.reject(new Error('Query must be provided as a non-empty string'));
        const pool:any = (await conn(config)).pool;
        if (!pool) return Promise.reject(new Error('Connection failed'));
        pool.setMaxListeners(15);
        const result = await  pool.request().query(Query);
        if (!result.recordset || result.recordset.length < 1) return Promise.reject(new Error('Database query returned no results'));
        return result.recordset;
    } catch (error:any) {
        throw new Error(`Error function recordByQuery: Internal Server Error`);
    } 
}