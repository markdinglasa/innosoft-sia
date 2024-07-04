import { Error, Success } from '@shared/messages';
import { Response, SqlChannel } from '@shared/types';
import { ipcMain } from 'electron';
import { isLicenseValid } from '../../../functions';

ipcMain.handle(SqlChannel.isLicense, async (_event: any, license:string): Promise<Response> => {
    try {
        if (!license) return ({IsSomething: false, Message: Error.e00x41})
        if (license.length < 1) return ({ IsSomething: false, Message: Error.e00x42 })
        const licenseValidation = await isLicenseValid(license);
        if (!licenseValidation.IsSomething) return ({ IsSomething: false, Message: licenseValidation.Message });
        return ({ IsSomething: true, Message: Success.s00x00 });
    } catch (error: any) {
        return ({ IsSomething: false, Message: Error.e00x02 });
    }
})
