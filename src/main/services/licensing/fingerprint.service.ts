import { exec } from 'child_process';
import { platform, release, arch } from 'os';
import { createHash } from 'crypto';

export class FingerprintService {
  /**
   * Generates a unique, reproducible hardware fingerprint.
   * Based on: BIOS Serial Number + Storage Volume UUID + OS Details.
   */
  static async generateFingerprint(): Promise<string> {
    const [bios, storage, osInfo] = await Promise.all([
      this.getBiosSerialNumber(),
      this.getStorageSerialNumber(),
      this.getOSInfo()
    ]);

    const rawData = `${bios}:${storage}:${osInfo}`;
    return createHash('sha256').update(rawData).digest('hex');
  }

  private static getBiosSerialNumber(): Promise<string> {
    return new Promise((resolve) => {
      const command = platform() === 'darwin'
        ? "system_profiler SPHardwareDataType | awk '/Serial Number \\(system\\)/ {print $4}'"
        : 'wmic bios get serialnumber';

      exec(command, (error, stdout) => {
        if (error || !stdout) {
          resolve('UNKNOWN_BIOS');
          return;
        }
        const lines = stdout.trim().split('\n');
        const serial = platform() === 'darwin' ? lines[0].trim() : lines[1]?.trim() || 'UNKNOWN_BIOS';
        resolve(serial);
      });
    });
  }

  private static getStorageSerialNumber(): Promise<string> {
    return new Promise((resolve) => {
      const command = platform() === 'darwin'
        ? "diskutil info / | awk '/Volume UUID/ {print $3}'"
        : 'wmic diskdrive get serialnumber';

      exec(command, (error, stdout) => {
        if (error || !stdout) {
          resolve('UNKNOWN_STORAGE');
          return;
        }
        const lines = stdout.trim().split('\n');
        const serial = platform() === 'darwin' ? lines[0].trim() : lines[1]?.trim() || 'UNKNOWN_STORAGE';
        resolve(serial);
      });
    });
  }

  private static getOSInfo(): string {
    return `${platform()}-${release()}-${arch()}`;
  }
}
