import { Error } from '@shared/messages'
import { QueryFn } from '@shared/query'
import { Response } from '@shared/types'
import { NVarChar } from 'mssql'
import { recordByFields } from '../../model'

/**
 * Get an existing user
 * @param {String} Username - Username of a user
 * @returns {Promise<JSON>} - returns a data of a user
 */

export const getUserByUsername = async (Username: string = ''): Promise<Response> => {
  try {
    if (typeof Username !== 'string' || !Username) return ({Data: null, Message: Error.e00x36})
    const user = (await recordByFields(QueryFn.q00x001, ['Username'], [NVarChar(255)], [Username]))
    if (!user.Data) return ({Data: null, Message: user.Message})
    return  ({Data: user.Data, Message: user.Message})
  } catch (error) {
    return  ({Data: null, Message: Error.e00x02})
  }
}
