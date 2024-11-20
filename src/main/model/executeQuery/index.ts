import { Error, Success } from '@shared/messages'
import { Response } from '@shared/types'
import { Connection } from '../../functions'
export const executeQuery = async (query: string): Promise<Response> => {
  try {
    if (!query || typeof query !== 'string') return { IsSomething: false, Message: Error.e00x31 }
    const pool: any = (await Connection()).pool
    if (!pool) return { IsSomething: false, Message: Error.e00x14 }
    pool.setMaxListeners(15)
    await pool.request().query(query)
    return { IsSomething: true, Message: Success.s00x00 }
  } catch (error: any) {
    return { IsSomething: false, Message: Error.e00x02 }
  }
}
