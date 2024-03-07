import * as CryptoJS from 'crypto-js';

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

export const XOREncryption = async(CodeKey: string, DataIn: string) => {
    let strDataOut: string = ''; 
    for (let lonDataPtr: number = 0; lonDataPtr < DataIn.length; lonDataPtr++) {
        const intXOrValue1: number = DataIn.charCodeAt(lonDataPtr);
        const intXOrValue2: number = CodeKey.charCodeAt(lonDataPtr % CodeKey.length);
        
        const temp: number = intXOrValue1 ^ intXOrValue2;
        let tempstring: string = temp.toString(16).toUpperCase();
        if (tempstring.length === 1) tempstring = '0' + tempstring;
        strDataOut += tempstring;
    }
    return strDataOut;
}

export const XOREncryption2 = async (CodeKey: string, DataIn: string) => {
    let strDataOut: string = '';
    for (let lonDataPtr = 0; lonDataPtr < DataIn.length; lonDataPtr++) {
        const intXOrValue1: number = DataIn.charCodeAt(lonDataPtr);
        const intXOrValue2: number = CodeKey.charCodeAt(lonDataPtr % CodeKey.length);
        
        // Ensure that values are within the range of 0 to 255
        const temp: number = (intXOrValue1 ^ intXOrValue2) & 0xFF;
        // Convert to hex with leading zero if needed
        let tempstring: string = temp.toString(16).toUpperCase();
        if (tempstring.length === 1) tempstring = '0' + tempstring;
        strDataOut += tempstring;
    }
    return strDataOut;
}
