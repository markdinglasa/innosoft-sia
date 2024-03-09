import { ipcMain } from "electron";
import electronStore from "electron-store";
import { XOREncryption, f677462696F73, f67747374726, f6C636E73766C64 } from "../functions";
//import queryData from '../texts/query.json';
//import tableData from '../texts/table.json';

// Handle the IPC message to read the file
ipcMain.handle('get-bios', async () => {
    try {
        // Return the entire JSON object
        const bios = await f67747374726()
        return bios;
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
});

ipcMain.handle('encrypt-key', async (_event, key) => {
    try {
        let upperCaseStr: string = key.toUpperCase()
        return await XOREncryption("Grocery", String(upperCaseStr));
    } catch (error) {
        console.error('Error encrypting key:', error);
        throw error; // Rethrow the error to handle it in the renderer process if needed
    }
});

ipcMain.handle('set-licenseKey', async (_event, key) => {
    try {
        const store = new electronStore()
        store.set('6B6579', key)
        return true
    } catch (error) {
        console.error('Error setting key:', error);
        throw error; // Rethrow the error to handle it in the renderer process if needed
    }
});

ipcMain.handle('get-licenseKey', async () => {
    try {
        const store = new electronStore()
        const key = store.get('6B6579')
        return key
    } catch (error) {
        console.error('Error getting key:', error);
        throw error; // Rethrow the error to handle it in the renderer process if needed
    }
});

ipcMain.handle('authenticate-licenseKey', async (c64617461: any) => {
    try {
        if (!c64617461) return { isLicensed: false, message: 'Unit key is missing', category: 'error'}
        if (c64617461.length < 1) return { IsLicensed: false, message: 'Unit key is null or undefined', category: 'error' }
        const licenseValidation = await f6C636E73766C64(c64617461);
        if (!licenseValidation.isValidated) return { isLicensed: true, message: licenseValidation.message, category: 'error' }
        return { isLicensed: true, message: licenseValidation.message, category: 'succesful' }
    } catch (error) {
        throw error; // Rethrow the error to handle it in the renderer process if needed
    }
});

ipcMain.handle('get-unitKey', async () => {
    try {
        const c62736E = await f677462696F73(), c53534E = await f67747374726()
        if(!c62736E || !c53534E) return 'Unit key not found'
        let c6B79 = `${c53534E}${c62736E}`;
        c6B79 = c6B79.replace(/[^\w]\s/g, '').replace('.','').replace('_','').replace('-',''); 
        return c6B79
      } catch (error) { 
        console.error('Error getting unit key:', error);
        throw error; // Rethrow the error to handle it in the renderer process if needed
      }
});

