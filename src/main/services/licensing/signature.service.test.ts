import { createSign, generateKeyPairSync } from 'crypto';
import { describe, expect, it } from 'vitest';
import { SignatureService } from './signature.service';

describe('SignatureService', () => {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    it('should verify a valid signature', () => {
        const payload = JSON.stringify({ deviceId: 'test-device', expirationDate: '2026-12-31' });
        const signer = createSign('SHA256');
        signer.update(payload);
        const signature = signer.sign(privateKey, 'base64');

        const isValid = SignatureService.verifySignature(payload, signature, publicKey);
        expect(isValid).toBe(true);
    });

    it('should fail if signature is invalid', () => {
        const payload = JSON.stringify({ deviceId: 'test-device', expirationDate: '2026-12-31' });
        const isValid = SignatureService.verifySignature(payload, 'invalid-signature', publicKey);
        expect(isValid).toBe(false);
    });

    it('should fail if payload was tampered with', () => {
        const payload = JSON.stringify({ deviceId: 'test-device', expirationDate: '2026-12-31' });
        const signer = createSign('SHA256');
        signer.update(payload);
        const signature = signer.sign(privateKey, 'base64');

        const tamperedPayload = JSON.stringify({ deviceId: 'test-device', expirationDate: '2027-12-31' });
        const isValid = SignatureService.verifySignature(tamperedPayload, signature, publicKey);
        expect(isValid).toBe(false);
    });
});
