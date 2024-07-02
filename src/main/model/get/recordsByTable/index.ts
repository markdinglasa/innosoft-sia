import { Connection } from '../../../config/database';
import { Config } from '../../../config/database';

/**
 * Retrieves all records from a given Table.
 * @param {string} Table
 * @returns {Promise<Array>}
*/
//

export const  recordsByTable = async (Config: Config, Table: string = ''): Promise<Array<any>> => {
    try {
        if (typeof Table !== 'string' || !Table) return Promise.reject(new Error('Table must be a string'));
        const pool = (await Connection(Config)).pool;
        if (!pool)  return Promise.reject(new Error(`Connection failed`));
        const request = pool.request();
        const result = await request.query(`SELECT * FROM [${Table}]`);
        if (!result.recordset || result.recordset.length < 1) return Promise.reject(new Error('Database query returned no results.'));
        return result.recordset;
    } catch (error:any) {
        throw new Error(`Error fetching all records from ${Table}: ${error.message}`);
    } 
};