import { SqlChannel } from '@shared/types/sql';
import { ipcMain } from 'electron';
import { loginSchema } from '../../../schema';

interface LogData {
    UserName: string;
    Password: string;
}

interface Response {
    isLogin: boolean;
    message: string
}

ipcMain.handle(SqlChannel.login, async (_event: any, {UserName, Password}: LogData ): Promise<Response> => {

    const { error }  = loginSchema.validate({ UserName, Password });
    if ( error ) return { isLogin: false, message: ERROR.e00x19 };
    
    const user = (await getUserByUsername(UserName));
    if (!user) return res.status(400).json({ isLogin: false, message: ERROR.e00x05 });

    const isPasswordValid = (Password === user.Password);
    if (!isPasswordValid) return res.status(400).json({ isLogin: false, message: ERROR.e00x19 });

    const accessToken = await generateToken(user.Id);
    
    return res
        .header('Authorization', `Bearer ${accessToken}`)
        .header('Refresh-Token', refreshToken)
        .json({ isLogin: true, user: user, accessToken: accessToken, refreshToken: refreshToken });
    } catch (error:any) {
        console.error('Error in login function:', error.message);
        return res.status(400).json({ isLogin: false, message: ERROR.e00x02 });
    }
})
