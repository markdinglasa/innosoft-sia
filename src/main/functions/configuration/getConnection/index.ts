import ElectronStore from 'electron-store'
import { Error, Success } from '../../../../shared/messages'
import { Response, SqlChannel } from '../../../../shared/types'

export const getConnection = (): Response => {
    try {
      const store = new ElectronStore()
      const config = store.get(SqlChannel.dbConfig)
      if (!config) return { Data: null, Message: Error.e00x43 }
      return { Data: config, Message: Success.s00x00 }
    } catch (error: any) {
      return { Data: null, Message: `${error}` }
    }
  }
  