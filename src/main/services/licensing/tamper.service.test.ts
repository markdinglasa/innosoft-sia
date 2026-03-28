import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TamperService, TamperStatus } from './tamper.service';

// Mock electron-store
vi.mock('electron-store', () => {
    return {
        default: class MockStore {
            private storage = {};
            constructor() {}
            get(key: string) { return this.storage[key]; }
            set(key: string, val: any) { this.storage[key] = val; }
        }
    };
});

describe('TamperService', () => {
    let service: TamperService;

    beforeEach(() => {
        service = new TamperService();
    });

    it('should detect backward clock', () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        
        service.updateLastKnownTime(futureDate);
        
        const now = new Date(); // Earlier than futureDate
        const status = service.checkClock(now);
        expect(status).toBe(TamperStatus.INVALID_TAMPERED);
    });

    it('should detect CMOS failure (old date)', () => {
        const oldDate = new Date('1970-01-01');
        const status = service.checkClock(oldDate);
        expect(status).toBe(TamperStatus.INVALID_DATE_WRONG);
    });

    it('should allow small clock drifts', () => {
        const now = new Date();
        const slightlyEarlier = new Date(now.getTime() - 1000 * 60 * 2); // 2 minutes ago
        
        service.updateLastKnownTime(now);
        const status = service.checkClock(slightlyEarlier);
        expect(status).toBe(TamperStatus.OK);
    });

    it('should be OK for normal forward matching', () => {
        const past = new Date('2024-01-01');
        service.updateLastKnownTime(past);
        
        const now = new Date();
        const status = service.checkClock(now);
        expect(status).toBe(TamperStatus.OK);
    });
});
