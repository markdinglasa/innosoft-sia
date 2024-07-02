import { Connection as conn } from '../../../config/database';
import storage from 'node-persist';
import { CONFIG } from '../../../shared';
/**
 * Retrieves specific record from a given fields.
 * @param {string}  Query
 * @param {Array}   Field
 * @param {Array}   Type
 * @param {Array}   Data
 * @returns {Promise<Array>}
 */

export const recordByFields = async (Query: string='', Field: Array<any> = [], Type: Array<any> = [], Data: Array<any> = []): Promise<Array<any>> => {
    try {
        const config = await storage.getItem(CONFIG);
        if (!Query || typeof Query !== 'string') return Promise.reject(new Error('Query is empty'));
        if (!Field.every(field => field !== undefined)) {
            const undefinedIndex1:any = Field.findIndex((field, _index) => field === undefined);
            return Promise.reject(new Error(`Field for field 'field${parseInt(undefinedIndex1, 10) +1}' is undefined`));
        }
        if (!Type.every((field: undefined) => field !== undefined)) {
            const undefinedIndex2:any = Type.findIndex((field: undefined, _index: any) => field === undefined);
            return Promise.reject(new Error(`Type for field 'field${parseInt(undefinedIndex2, 10) +1}' is undefined`));
        }
        if (!Data.every(field => field !== undefined)) {
            const undefinedIndex3:any = Data.findIndex((field, _index) => field === undefined);
            return Promise.reject(new Error(`Data for field 'field${parseInt(undefinedIndex3, 10) +1}' is undefined`));
        }
        if (Field.length !== Data.length || Field.length !== Type.length) return Promise.reject(new Error('Parameters are empty, or their lengths do not match'));
        const pool:any = (await conn(config.config)).pool;
        if (!pool)  return Promise.reject(new Error(`Connection failed`));
        pool.setMaxListeners(15);
        const request = pool.request();
        for (let i = 0; i < Field.length; i++) {
            if (Data[i] === undefined) return Promise.reject(new Error(`Data for field '${Field[i]}' is undefined`));
            request.input(Field[i], Type[i], Data[i]);
        }
        const result = await request.query(Query);
        if (!result.recordset || result.recordset.length < 1) return Promise.reject(new Error('Database query returned no results'));
        return result.recordset;
    } catch (error:any) {
        throw new Error(`Error function recordByFields : Internal Server Error`);
    } 
}