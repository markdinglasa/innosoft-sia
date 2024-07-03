import { recordByFields } from '../../model';

/**
 * Check if the records already exists
 * @param {string} Query - The name of the table
 * @param {Array<string>} Field - The array of field names
 * @param {Array<string>} Type - The array of SQL data types corresponding to the fields
 * @param {Array<any>} Data - The array of data values corresponding to the fields
 * @returns {Promise<boolean>} - Returns true if the record exists, otherwise false
 */

export const findByFields = async (Query: string = '', Field: Array<string> = [], Type: Array<any> = [], Data: Array<any> = []): Promise<boolean> => {
    let flag = false;
    try {
        if (typeof Query !== 'string' || !Query) return flag;
        if (!Field || !Type || !Data || Field.length !== Type.length || Field.length !== Data.length) return flag;
        const check = (await recordByFields(Query, Field, Type, Data)).Data;
        if (check && check.length > 0) flag = true;
        return flag;
    } catch (error:any) {
        console.log('Error in findByFields function:', error.message);
        return flag;
    }
}; // END HERE