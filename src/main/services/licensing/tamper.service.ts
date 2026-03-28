import Store from 'electron-store';

export enum TamperStatus {
  OK = 'OK',
  INVALID_TAMPERED = 'INVALID_TAMPERED', // Clock was moved backward
  INVALID_DATE_WRONG = 'INVALID_DATE_WRONG' // Date is before 2024 (CMOS battery empty)
}

export class TamperService {
  private store: Store;
  private readonly STORAGE_KEY = 'lic_last_known_time';
  private readonly DRIFT_TOLERANCE_MS = 1000 * 60 * 5; // 5 minutes tolerance

  constructor() {
    this.store = new Store({
      name: 'licensing-tamper',
      encryptionKey: 'your-secure-encryption-key' // Ideally this should be more robust
    });
  }

  /**
   * Updates the last known successful validation timestamp.
   * @param date The current date and time.
   */
  updateLastKnownTime(date: Date = new Date()): void {
    try {
      this.store.set(this.STORAGE_KEY, date.toISOString());
    } catch (error) {
      console.error('Failed to update last known time:', error);
    }
  }

  /**
   * Checks the current system clock for signs of tampering.
   * @param currentDate The current system date to check.
   */
  checkClock(currentDate: Date = new Date()): TamperStatus {
    try {
      // 1. Check for obvious system clock reset (CMOS battery failure)
      const minDate = new Date('2024-01-01');
      if (currentDate < minDate) {
        return TamperStatus.INVALID_DATE_WRONG;
      }

      // 2. Check for backward clock (tampering attempts)
      const lastKnownIso = this.store.get(this.STORAGE_KEY) as string;
      if (!lastKnownIso) {
        // First run, no history yet
        return TamperStatus.OK;
      }

      const lastKnownTime = new Date(lastKnownIso).getTime();
      const currentTime = currentDate.getTime();

      // If current time is earlier than the last known record (with some DRIFT_TOLERANCE_MS)
      if (currentTime < lastKnownTime - this.DRIFT_TOLERANCE_MS) {
        return TamperStatus.INVALID_TAMPERED;
      }

      return TamperStatus.OK;
    } catch (error) {
      console.error('Clock sanity check failed:', error);
      return TamperStatus.OK; // Default to OK but log error, or should it be INVALID?
    }
  }
}
