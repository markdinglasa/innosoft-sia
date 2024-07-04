import { Error, Success } from '@shared/messages';
import { SqlChannel } from '@shared/types';
import { ipcMain } from 'electron';
import { isLicenseValid } from '../../../functions';

interface Response {
    IsLicense: boolean;
    Message: string;
}

ipcMain.handle(SqlChannel.isLicense, async (_event: any, license:string): Promise<Response> => {
    try {
        if (!license) return ({IsLicense: false, Message: Error.e00x41})
        if (license.length < 1) return ({ IsLicense: false, Message: Error.e00x42 })
        const licenseValidation = await isLicenseValid(license);
        if (!licenseValidation.IsValid) return ({ IsLicense: false, Message: licenseValidation.Message });
        return ({ IsLicense: true, Message: Success.s00x00 });
    } catch (error: any) {
        return ({ IsLicense: false, Message: Error.e00x02 });
    }
})
