import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FingerprintService } from './fingerprint.service';
import { SignatureService } from './signature.service';
import { LicenseStatus, ValidationService } from './validation.service';

vi.mock('./fingerprint.service');
vi.mock('./signature.service');

describe('ValidationService', () => {
    const mockDeviceId = 'test-device-id';
    const mockPublicKey = 'test-public-key';

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(FingerprintService.generateFingerprint).mockResolvedValue(mockDeviceId);
    });

    it('should return ACTIVE for valid, non-expired license', async () => {
        const payload = {
            deviceId: mockDeviceId,
            expirationDate: '2099-12-31',
            graceDays: 7
        };
        const license = {
            payload: JSON.stringify(payload),
            signature: 'valid-sig'
        };

        vi.mocked(SignatureService.verifySignature).mockReturnValue(true);

        const status = await ValidationService.validateLicense(license, mockPublicKey);
        expect(status).toBe(LicenseStatus.ACTIVE);
    });

    it('should return GRACE if expired but within grace period', async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const payload = {
            deviceId: mockDeviceId,
            expirationDate: yesterday.toISOString(),
            graceDays: 7
        };
        const license = {
            payload: JSON.stringify(payload),
            signature: 'valid-sig'
        };

        vi.mocked(SignatureService.verifySignature).mockReturnValue(true);

        const status = await ValidationService.validateLicense(license, mockPublicKey);
        expect(status).toBe(LicenseStatus.GRACE);
    });

    it('should return EXPIRED if past grace period', async () => {
        const longAgo = new Date();
        longAgo.setDate(longAgo.getDate() - 10);
        
        const payload = {
            deviceId: mockDeviceId,
            expirationDate: longAgo.toISOString(),
            graceDays: 7
        };
        const license = {
            payload: JSON.stringify(payload),
            signature: 'valid-sig'
        };

        vi.mocked(SignatureService.verifySignature).mockReturnValue(true);

        const status = await ValidationService.validateLicense(license, mockPublicKey);
        expect(status).toBe(LicenseStatus.EXPIRED);
    });

    it('should return INVALID if deviceId mismatch', async () => {
        const payload = {
            deviceId: 'wrong-device',
            expirationDate: '2099-12-31',
            graceDays: 7
        };
        const license = {
            payload: JSON.stringify(payload),
            signature: 'valid-sig'
        };

        vi.mocked(SignatureService.verifySignature).mockReturnValue(true);

        const status = await ValidationService.validateLicense(license, mockPublicKey);
        expect(status).toBe(LicenseStatus.DEVICE_MISMATCH);
    });

    it('should return INVALID if signature is invalid', async () => {
        const payload = {
            deviceId: mockDeviceId,
            expirationDate: '2099-12-31',
            graceDays: 7
        };
        const license = {
            payload: JSON.stringify(payload),
            signature: 'invalid-sig'
        };

        vi.mocked(SignatureService.verifySignature).mockReturnValue(false);

        const status = await ValidationService.validateLicense(license, mockPublicKey);
        expect(status).toBe(LicenseStatus.INVALID);
    });
});
