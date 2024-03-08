import { exec } from 'child_process';
import crypto from 'crypto';
import * as CryptoJS from 'crypto-js';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import tableData from '../texts/tables.json';

// Encryption function
export const encryptData = async (data: string, key: string) => {
    const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
    return encryptedData;
}

// Decryption function
export const decryptData = async (encryptedData: string, key: string) => {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
    return decryptedData;
}

/****************************************************************
  STATUS               : WORKING
  DATE CREATED/UPDATED : February 08, 2024
  PURPOSE              : to encrypt data
  PROGRAMMER           : MARK DINGLASA
  FUNCTION NAME        : XORDecryption(CodeKey, DataIn)
****************************************************************/
export const XORDecryption = async (c63646B79: string, c64617461: string) => {
    try{
      let d72736C74 = '', c76616C31: number, c76616C32: number;
      for (let lonDataPtr = 0; lonDataPtr < c64617461.length; lonDataPtr += 2) {
          c76616C31 = parseInt(c64617461.substr(lonDataPtr, 2), 16);
          c76616C32 = c63646B79.charCodeAt(lonDataPtr / 2 % c63646B79.length);
          d72736C74 += String.fromCharCode(c76616C31 ^ c76616C32);
      } return d72736C74;
    }catch(error){
      console.log(error); return null;
    }
  }// END FUNCTION

/****************************************************************
  STATUS               : WORKING
  DATE CREATED/UPDATED : February 08, 2024
  PURPOSE              : to encrypt data
  PROGRAMMER           : MARK DINGLASA
  FUNCTION NAME        : XOREncryption(CodeKey, DataIn)
****************************************************************/
export const XOREncryption = async (c63646B79: string, c64617461: string) => {
    try{
      if (!c64617461 || !c64617461.length) return 'DataIn is undefined, null, or empty.';
      let d72736C74 = '';
      for (let lonDataPtr = 0; lonDataPtr < c64617461.length; lonDataPtr++) {
        const c76616C31 = c64617461.charCodeAt(lonDataPtr);
        const c76616C32 = c63646B79.charCodeAt(lonDataPtr % c63646B79.length);
        const c746D70 = (c76616C31 % 256) ^ (c76616C32 % 256);
        let c746D70737472 = c746D70.toString(16).toUpperCase();
        if (c746D70737472.length === 1) c746D70737472 = '0' + c746D70737472;
        d72736C74 += c746D70737472;
      } return d72736C74;
    } catch(error){
      console.log(error); return null;
    }
  }// END FUNCTION


/****************************************************************
  STATUS               : WORKING
  DATE CREATED/UPDATED : February 08, 2024
  PURPOSE              : to get motherboard BIOS Serial Number
  PROGRAMMER           : MARK DINGLASA
  FUNCTION NAME        : getBiosSerialNumber()
****************************************************************/
export const f677462696F73 = async (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      exec('wmic bios get serialnumber', (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        const lines = stdout.trim().split('\n');
        if (lines.length < 2) {
          reject(new Error('No serial number found'));
          return;
        }
        const serialNumber = lines[1].trim();
        resolve(serialNumber);
      });
    });
  }// END FUNCTION

  /****************************************************************
  STATUS               : WORKING
  DATE CREATED/UPDATED : February 08, 2024
  PURPOSE              : to get the primary storage device serial number
  PROGRAMMER           : MARK DINGLASA
  FUNCTION NAME        : getStorageSerialNumber()
****************************************************************/
export const f67747374726  = async (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        exec('wmic diskdrive get serialnumber', (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }
          if (!stdout || stdout.trim() === '') {
            reject(new Error('No serial number found'));
            return;
          }
          const lines = stdout.trim().split('\n');
          const serialNumber = lines[1].trim();
          resolve(serialNumber);
        });
    });
  }; // END FUNCTION

/****************************************************************
  STATUS               : WORKING
  DATE CREATED/UPDATED : February 08, 2024
  PURPOSE              : to validate license-key
  PROGRAMMER           : MARK DINGLASA
  FUNCTION NAME        : licenseValidator(Key) //boolean
****************************************************************/
export const f6C636E73766C64 = async (licenseKey: any) => {
    try {
        // Assuming these values are coming from elsewhere or passed as parameters
        const serialNumber = await f677462696F73();
        const diskSerialNumber = await f67747374726();

        if (!serialNumber || !diskSerialNumber) return false;

        const concatenatedString = `${tableData.na00x02}${tableData.na00x01}`;
        const decryptedLicense: any = await XORDecryption(concatenatedString, String(licenseKey));

        const parts = decryptedLicense.split('.');
        let combinedSerialNumbers = `${diskSerialNumber}${serialNumber}`;
        combinedSerialNumbers = combinedSerialNumbers.replace(/[^\w]/g, '').replace('.', '').replace('_', '').replace('-', '');

        if (String(combinedSerialNumbers) !== String(parts[0])) return false;

        let licenseType = (String(parts[1]) === 'retail') ? 'retail' : ((String(parts[1]) === 'restaurant') ? 'restaurant' : ((String(parts[1]) === 'hotel') ? 'hotel' : 'none'));
        let userType = (String(parts[2]) === 'administrator') ? 'administrator' : ((String(parts[2]) === 'cashier') ? 'cashier' : ((String(parts[2]) === 'teller') ? 'teller' : 'none'));
        let duration = (String(parts[3]) === '7') ? '7' : (String(parts[3]) === '14') ? '14' : ((String(parts[3]) === '30') ? '30' : ((String(parts[3]) === '90') ? '90' : ((String(parts[3]) === '365') ? '365' : '0')));

        const startDate = new Date(String(parts[4]));
        const expiryDate = new Date(startDate.getTime() + parseInt(duration, 10) * 24 * 60 * 60 * 1000);
        const currentDate = new Date();

        const formatter = new Intl.DateTimeFormat('en-PH', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const [{ value: month }, , { value: day }, , { value: year }] = formatter.formatToParts(startDate);
        const formattedDate = `${year}/${month}/${day}`;

        if (currentDate >= expiryDate) {
            console.log('License expired');
            return false;
        }

        let licenseInfo = `${combinedSerialNumbers}.${licenseType}.${userType}.${duration}.${formattedDate}`;
        let encryptedLicense = await XOREncryption(concatenatedString, licenseInfo);
        console.log(encryptedLicense)
        return (encryptedLicense === licenseKey);
    } catch (error) {
        console.error(error);
        return false;
    }
};

  /****************************************************************
  STATUS               : FOR TESTING
  DATE CREATED/UPDATED : February 07, 2024
  PURPOSE              : to read the data of the file
  PROGRAMMER           : MARK DINGLASA
  FUNCTION NAME        : readFileLines(filepath)
****************************************************************/
export const readFileLines = async (filepath: string): Promise<any | null> => {
    try {
      const fileContent = await fs.promises.readFile(filepath, 'utf8');
      if (!fileContent) return null;
      return JSON.parse(fileContent);
    } catch (error) {
      if (error instanceof SyntaxError && error.message.includes('Unexpected end of JSON input')) return null;
      console.log(error);
      return null; // Fixed typo here, should be 'return' instead of 'retrn'
    }
  }; // END FUNCTION

  /****************************************************************
  STATUS               : WORKING
  DATE CREATED/UPDATED : February 07, 2024
  PURPOSE              : to upload an image, and copy the imagefile to a specified folder
  PROGRAMMER           : MARK DINGLASA
  FUNCTION NAME        : uploadimage(image)
****************************************************************/
export const uploadImage = async (image: string): Promise<string | null> => {
    try {
      const mbSize = 1048576; // 1 MB in bytes
      const parsedImage = path.parse(image);
      const filename = parsedImage.base.replace(/\\/g, '/');
      const baseDirectory = path.join(__dirname, '..', '..', 'frontend', 'src', 'assets', 'images'); // IN PRODUCTION
      // const baseDirectory = path.join(__dirname, '..', '..', 'public', 'image'); // ONLY BACKEND
      const extname = parsedImage.ext.toLowerCase();
  
      // Check if the provided path is a directory
      const isDirectory = await promisify(fs.stat)(image).then((stats) => stats.isDirectory());
      if (isDirectory) {
        console.log('Provided path is a directory.');
        return null;
      }
  
      // Check if an image is selected
      if (!filename) {
        console.log('Please select an image.');
        return null;
      }
  
      // Check if the file extension is supported
      if (extname !== '.jpg' && extname !== '.png' && extname !== '.jpeg') {
        console.log('Unsupported file extension.');
        return null;
      }
  
      // Check file size
      const imageStats = await promisify(fs.stat)(image);
      if (imageStats.size > 2 * mbSize) {
        console.log('Image file size exceeds the limit.');
        return null;
      }
  
      // Generate unique filename based on MD5 hash and current timestamp
      const uniqueFilename = `${crypto.createHash('md5').update(filename).digest('hex')}_${Date.now()}${extname}`;
  
      // Copy file to destination folder
      await promisify(fs.copyFile)(image, path.join(baseDirectory, uniqueFilename));
  
      return uniqueFilename;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
