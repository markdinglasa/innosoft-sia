import { FingerprintService } from './fingerprint.service';
import { SignatureService } from './signature.service';

export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  GRACE = 'GRACE',
  EXPIRED = 'EXPIRED',
  INVALID = 'INVALID',
  NO_LICENSE = 'NO_LICENSE',
  DEVICE_MISMATCH = 'DEVICE_MISMATCH'
}

export interface LicensePayload {
  deviceId: string;
  expirationDate: string;
  graceDays: number;
}

export interface LicenseData {
  payload: string;
  signature: string;
}

export class ValidationService {
  /**
   * Validates the license and determines its current status.
   * @param license The license data containing payload and signature.
   * @param publicKey The public key to verify the signature.
   */
  static async validateLicense(license: LicenseData | null, publicKey: string): Promise<LicenseStatus> {
    if (!license || !license.payload || !license.signature) {
      return LicenseStatus.NO_LICENSE;
    }

    try {
      // 1. Verify digital signature
      const isSignatureValid = SignatureService.verifySignature(license.payload, license.signature, publicKey);
      if (!isSignatureValid) {
        return LicenseStatus.INVALID;
      }

      // 2. Parse payload
      const payload: LicensePayload = JSON.parse(license.payload);
      
      // 3. Verify device binding
      const currentDeviceId = await FingerprintService.generateFingerprint();
      if (payload.deviceId !== currentDeviceId) {
        return LicenseStatus.DEVICE_MISMATCH;
      }

      // 4. Check expiration and grace period
      const expirationDate = new Date(payload.expirationDate);
      const now = new Date();
      
      if (now <= expirationDate) {
        return LicenseStatus.ACTIVE;
      }

      const graceEndDate = new Date(expirationDate);
      graceEndDate.setDate(graceEndDate.getDate() + (payload.graceDays || 0));

      if (now <= graceEndDate) {
        return LicenseStatus.GRACE;
      }

      return LicenseStatus.EXPIRED;
    } catch (error) {
      console.error('License validation failed:', error);
      return LicenseStatus.INVALID;
    }
  }
}
