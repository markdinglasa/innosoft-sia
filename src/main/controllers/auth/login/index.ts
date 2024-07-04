import { Error, Success } from '@shared/messages'
import { LogData, Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { generateToken, getUserByUsername } from '../../../functions'
import { loginSchema } from '../../../schema'

ipcMain.handle(
  SqlChannel.login,
  async (_event: any, { UserName, Password }: LogData): Promise<Response> => {
    try {
      const { error } = loginSchema.validate({ UserName, Password })
      if (error) return { IsSomething: false, Message: Error.e00x19 }
      const user = await getUserByUsername(UserName)
      if (!user.Data) return { IsSomething: false, Message: Error.e00x05 }
      const isPasswordValid = Password === user.Data[0].Password
      if (!isPasswordValid) return { IsSomething: false, Message: Error.e00x19 }
      const accessToken = await generateToken(user.Data[0].Id)
      if (!accessToken.Data) return { IsSomething: false, Message: accessToken.Message }
      return {
        IsSomething: true,
        Data: user.Data,
        Option: accessToken.Data,
        Message: Success.s00x00
      }
    } catch (err: any) {
      return { IsSomething: false, Message: Error.e00x02 }
    }
  }
)
