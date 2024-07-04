import { Error } from '@shared/messages';
import { Response } from '@shared/types';
import { recordByFields } from '../../../model';

/**
 * Check if the records already exists
 * @param {string} Query - The name of the table
 * @param {Array<string>} Field - The array of field names
 * @param {Array<string>} Type - The array of SQL data types corresponding to the fields
 * @param {Array<any>} Data - The array of data values corresponding to the fields
 * @returns {Promise<boolean>} - Returns true if the record exists, otherwise false
 */
export const findByFields = async (
  Query: string = '',
  Field: Array<string> = [],
  Type: Array<any> = [],
  Data: Array<any> = []
): Promise<Response> => {
  try {
    if (typeof Query !== 'string' || !Query) return { IsSomething: false, Message: Error.e00x31 }
    if (!Field || !Type || !Data || Field.length !== Type.length || Field.length !== Data.length)
      return { IsSomething: false, Message: Error.e00x35 }
    const check = await recordByFields(Query, Field, Type, Data)
    if (!check.List) return { IsSomething: false, Message: check.Message }
    return { IsSomething: true, Message: check.Message }
  } catch (error: any) {
    return { IsSomething: true, Message: Error.e00x02 }
  }
} // END HERE
