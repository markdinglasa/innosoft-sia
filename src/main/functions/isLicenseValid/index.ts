import { CODE_KEY } from '@shared/constants';
import { Error, Success } from '@shared/messages';
import { XORDecryption, XOREncryption, getBiosSerialNumber, getStorageSerialNumber } from '..';

interface Response {
    IsValid: boolean;
    Message: string;
}

export const isLicenseValid = async (license: string): Promise<Response> => {
    try {
        const bios: string = await getBiosSerialNumber()
        const strg: string  = await getStorageSerialNumber()
        if (!bios || !strg) return { IsValid: false, Message: Error.e00x37 }
        const decryptedLicense: string = await XORDecryption(CODE_KEY, license)
        const parts = decryptedLicense.split('.');
        let combinedSerialNumbers = `${bios}${strg}`.replace(/[^\w]/g, '').replace('.', '').replace('_', '').replace('-', '');
        combinedSerialNumbers = await XOREncryption(CODE_KEY, combinedSerialNumbers);
        if (String(combinedSerialNumbers) !== String(parts[0])) return { IsValid:false, Message: Error.e00x38 }
        let licenseType = (String(parts[1]) === 'retail') ? 'retail' : ((String(parts[1]) === 'restaurant') ? 'restaurant' : ((String(parts[1]) === 'hotel') ? 'hotel' : 'none'));
        let userType = (String(parts[2]) === 'administrator') ? 'administrator' : ((String(parts[2]) === 'cashier') ? 'cashier' : ((String(parts[2]) === 'teller') ? 'teller' : 'none'));
        let duration = (String(parts[3]) === '7') ? '7' : (String(parts[3]) === '14') ? '14' : ((String(parts[3]) === '30') ? '30' : ((String(parts[3]) === '90') ? '90' : ((String(parts[3]) === '365') ? '365' : '0')));
        const startDate = new Date(String(parts[4]));
        const expiryDate = new Date(startDate.getTime() + parseInt(duration, 10) * 24 * 60 * 60 * 1000);
        const currentDate = new Date();
        const formatter = new Intl.DateTimeFormat('en-PH', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const [{ value: month }, , { value: day }, , { value: year }] = formatter.formatToParts(startDate);
        const formattedDate = `${year}/${month}/${day}`;
        if (currentDate >= expiryDate) return { IsValid:false, Message: Error.e00x39 }
        let licenseInfo = `${combinedSerialNumbers}.${licenseType}.${userType}.${duration}.${formattedDate}`;
        let encryptedLicense = await XOREncryption(CODE_KEY, licenseInfo);
        return (encryptedLicense === license)?{ IsValid:true, Message: Success.s00x00 } : { IsValid:false, Message: Error.e00x40 }
        } catch (error) {
        return { IsValid:false, Message: Error.e00x02 }
    }
};