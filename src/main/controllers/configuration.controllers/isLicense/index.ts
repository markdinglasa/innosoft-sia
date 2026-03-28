import { ERROR, Success } from '@shared/messages'
import { Response, SqlChannel } from '@shared/types'
import { ipcMain } from 'electron'
import { ValidationService, LicenseStatus, LicenseData } from '../../../services/licensing/validation.service'
import { TamperService, TamperStatus } from '../../../services/licensing/tamper.service'
import { LICENSING_PUBLIC_KEY } from '../../../services/licensing/constants'
import { isLicenseValid } from '../../../functions'

const tamperService = new TamperService();

ipcMain.handle(
  SqlChannel.isLicense,
  async (_event: unknown, license: string): Promise<Response> => {
    try {
      if (!license) return { IsSomething: false, Message: ERROR.e00x41 }
      
      // 1. Clock Protection (Anti-Tamper)
      const clockStatus = tamperService.checkClock();
      if (clockStatus === TamperStatus.INVALID_DATE_WRONG) {
        return { IsSomething: false, Message: 'Please update your system time.' };
      }
      if (clockStatus === TamperStatus.INVALID_TAMPERED) {
        return { IsSomething: false, Message: 'License tampered: System clock manipulation detected.' };
      }

      // 2. Try New License Format (JSON with Signature)
      let licenseData: LicenseData | null = null;
      try {
        licenseData = JSON.parse(license);
      } catch (e) {
        // Not a JSON, maybe legacy format
      }

      if (licenseData && licenseData.payload && licenseData.signature) {
        const status = await ValidationService.validateLicense(licenseData, LICENSING_PUBLIC_KEY);
        
        if (status === LicenseStatus.ACTIVE || status === LicenseStatus.GRACE) {
          tamperService.updateLastKnownTime(); // Update time only on successful validation
          return { IsSomething: true, Message: status === LicenseStatus.GRACE ? 'GRACE' : Success.s00x00, Option: status };
        }
        
        return { 
          IsSomething: false, 
          Message: status === LicenseStatus.EXPIRED ? 'License expired.' : 'Invalid license.',
          Option: status 
        };
      }

      // 3. Fallback to Legacy XOR Format
      const legacyValidation = await isLicenseValid(license)
      if (legacyValidation.IsSomething) {
        tamperService.updateLastKnownTime();
        return { IsSomething: true, Message: Success.s00x00, Option: LicenseStatus.ACTIVE };
      }
      
      return { IsSomething: false, Message: legacyValidation.Message };
    } catch (error: unknown) {
      console.error('License controller error:', error)
      return { IsSomething: false, Message: (error as Error).message || ERROR.e00x02 }
    }
  }
)

