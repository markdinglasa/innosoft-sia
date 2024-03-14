import { ipcMain } from "electron";
//import queryData from '../texts/query.json';
//import tableData from '../texts/table.json';

ipcMain.handle('login', async () => {
    try {
      // Check the connection status
      const connection = await Connection()
      if (!connection.isConnected) {
        return { connected: false }
      }
      return { connected: true }
    } catch (error) {
      console.error('Error checking connection:', error)
      throw new Error('Failed to check connection: ' + error)
    }
  })
  