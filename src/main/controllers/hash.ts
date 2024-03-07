import { ipcMain } from "electron";
import { XOREncryption } from "../functions";

ipcMain.handle('encrypt-key', async (_event, key) => {
    try {
        let upperCaseStr: string = key.toUpperCase()
        return await XOREncryption("Grocery", String(upperCaseStr));
    } catch (error) {
        console.error('Error encrypting key:', error);
        throw error; // Rethrow the error to handle it in the renderer process if needed
    }
});
