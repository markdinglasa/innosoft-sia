/**
 * AUTHOR       : Mark Dinglasa
 * COMMENT/S    : N/A
 * CHANGES      : N/A
 * LOG-DATE     : 2024-05-27 11:48PM
*/

import { Error, Success } from '@shared/messages';
import { Response } from '@shared/types';
import { recordByFields } from '../../model';

/**
 * Check if the record already exists
 * @param {string} Table - The name of the table
 * @param {Array<string>} Field - The array of field names
 * @param {Array<string>} Type - The array of SQL data types corresponding to the fields
 * @param {Array<any>} Data - The array of data values corresponding to the fields
 * @returns {Promise<boolean>} - Returns true if the record exists, otherwise false
 */
export const isFound = async (
  Table: string = '',
  Field: Array<string> = [],
  Type: Array<any> = [],
  Data: Array<any> = []
): Promise<Response> => {
  try {
    if (!Table || typeof Table !== 'string') return { IsSomething: false, Message: Error.e00x28 }
    if (!Field || !Type || !Data || Field.length !== Type.length || Field.length !== Data.length)
      return { IsSomething: false, Message: Error.e00x35 }
    const conditions = Field.map((field, _index) => `${field} = @${field}`).join(' AND ')
    const check = await recordByFields(
      `SELECT TOP 1 FROM [${Table}] WHERE ${conditions}`,
      Field,
      Type,
      Data
    )
    if (!check.List) return { IsSomething: false, Message: check.Message }
    return { IsSomething: true, Message: Success.s00x01 }
  } catch (error: any) {
    return { IsSomething: false, Message: Error.e00x02 }
  }
} // END HERE
