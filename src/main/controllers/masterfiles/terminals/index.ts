import { ERROR, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { AppDataSource } from '../../../typeORM/configurations'
import { MstTerminalEntity } from '../../../entities/masterfiles/MstTerminal.entity'

ipcMain.handle(SqlChannel.getTerminals, async (): Promise<Response> => {
  try {
    const terminals = await AppDataSource.getRepository(MstTerminalEntity).find()
    return { Data: terminals, Message: Success.s00x00 }
  } catch (error: any) {
    console.error('Error fetching terminals:', error)
    return { IsSomething: false, Message: error.message || ERROR.e00x02 }
  }
})
