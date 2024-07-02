import { exec } from "child_process";

export const getStorageSerialNumber = () => {
    return new Promise((resolve, reject) => {
      exec('wmic diskdrive get serialnumber', (error, stdout) => {
        if (error) { reject(error); return;
        }
        const lines = stdout.trim().split('\n'), storageSerialNumber = lines[1].trim();
        resolve(storageSerialNumber);
      });
    });
};