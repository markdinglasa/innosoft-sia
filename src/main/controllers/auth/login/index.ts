import { Error, Success } from '@shared/messages';
import { SqlChannel } from '@shared/types/sql';
import { ipcMain } from 'electron';
import { generateToken, getUserByUsername } from '../../../functions';
import { loginSchema } from '../../../schema';

interface LogData {
    UserName: string;
    Password: string;
}

interface Response {
    IsLogin: boolean;
    Message: string;
    AccessToken?: string;
    User?: any;
}

ipcMain.handle(SqlChannel.login, async (_event: any, {UserName, Password}: LogData ): Promise<Response> => {
    try{
    const { error }  = loginSchema.validate({ UserName, Password })
    if ( error ) return ({ IsLogin: false, Message: Error.e00x19 })
    const user = ((await getUserByUsername(UserName)))
    if (!user.Data) return ({ IsLogin: false, Message: Error.e00x05 })
    const isPasswordValid = (Password === user.Data[0].Password)
    if (!isPasswordValid) return ({ IsLogin: false, Message: Error.e00x19 })
    const accessToken = await generateToken(user.Data[0].Id)
    return ({ IsLogin: true, User: user.Data, AccessToken: accessToken, Message: Success.s00x00})
    } catch (err:any) {
        return ({ IsLogin: false, Message: Error.e00x02 });
    }
})
