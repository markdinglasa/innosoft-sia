import { exec } from "child_process";

export const getBiosSerialNumber = async (): Promise<any> =>{
    return new Promise((resolve, reject) => {
      exec('wmic bios get serialnumber', (error, stdout) => {
        if (error) {  reject(error); return;
        }
        const lines = stdout.trim().split('\n'), biosSerialNumber = lines[1].trim();
        resolve(biosSerialNumber);
      });
    });
};