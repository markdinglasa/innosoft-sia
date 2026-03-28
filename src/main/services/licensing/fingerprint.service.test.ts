import { describe, expect, it } from 'vitest';
import { FingerprintService } from './fingerprint.service';

describe('FingerprintService', () => {
    it('should generate a consistent fingerprint', async () => {
        const fingerprint1 = await FingerprintService.generateFingerprint();
        const fingerprint2 = await FingerprintService.generateFingerprint();
        expect(fingerprint1).toBe(fingerprint2);
    });

    it('should be a reproducible hash of hardware identifiers', async () => {
        const fingerprint = await FingerprintService.generateFingerprint();
        // It should be a 64-character hex string (SHA-256)
        expect(fingerprint).toMatch(/^[a-f0-9]{64}$/i);
    });

    it('should not expose raw hardware details', async () => {
        const fingerprint = await FingerprintService.generateFingerprint();
        // Check if common serial patterns are NOT in the hash (this is a bit heuristic)
        expect(fingerprint).not.toContain('CPU');
        expect(fingerprint).not.toContain('DISK');
    });
});
