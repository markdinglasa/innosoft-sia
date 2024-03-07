import { ipcMain } from "electron";
import { getDataByTable } from '../functions';

ipcMain.handle('get-account-list', async () => {
    try {
        return await getDataByTable('MstAccount');
    } catch (error) {
        console.error('Error fetching account list:', error);
        throw error; // Rethrow the error to handle it in the renderer process if needed
    }
});
