/**
 * AUTHOR       : Mark Dinglasa
 * COMMENT/S    : N/A
 * CHANGES      : N/A
 * LOG-DATE     : 2024-05-27 11:48PM
*/

import { recordByFields } from '../../model';

/**
 * Check if the record already exists
 * @param {string} Table - The name of the table
 * @param {Array<string>} Field - The array of field names
 * @param {Array<string>} Type - The array of SQL data types corresponding to the fields
 * @param {Array<any>} Data - The array of data values corresponding to the fields
 * @returns {Promise<boolean>} - Returns true if the record exists, otherwise false
*/
export const isFound  = async (Table: string = '', Field: Array<string> = [], Type: Array<any> = [], Data: Array<any> = []): Promise<boolean> => {
    let flag = false;
    try {
        if (!Table || typeof Table !== 'string') return flag;
        if (!Field || !Type || !Data || Field.length !== Type.length || Field.length !== Data.length) return flag;
        const conditions = Field.map((field, _index) => `${field} = @${field}`).join(' AND ');
        const check = (await recordByFields(`SELECT TOP 1 FROM [${Table}] WHERE ${conditions}`, Field, Type, Data)).Data;
        if (check && check.length > 0) flag = true;
    } catch (error:any) {
        console.log('Error in isFound function:', error.message);
    }
    return flag;
}; // END HERE