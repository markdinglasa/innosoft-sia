import { sign } from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET } from '../../../shared/constants'
import { Error, Success } from '../../../shared/messages'
import { Response } from '../../../shared/types'

/**
 * Creates a new token
 * @param {number} User - User Id
 * @returns {Promise<String>} - returns a string of encrypted token
 */
export const generateToken = async (User: number = 0): Promise<Response> => {
  try {
    if (isNaN(User) || typeof User !== 'number') return { Data: null, Message: Error.e00x44 }
    const token = sign({ User }, ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
    if (!token) return { Data: null, Message: Error.e00x01 }
    return { Data: token, Message: Success.s00x00 }
  } catch (error: any) {
    return { Data: null, Message: Error.e00x02 }
  }
}
