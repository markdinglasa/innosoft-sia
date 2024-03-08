import { ipcMain } from 'electron'
import electronStore from 'electron-store'
import { Connection } from '../functions'

ipcMain.handle('get-connected', async () => {
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

ipcMain.handle('set-connection', async (_event, config) => {
  try {
    const store = new electronStore()
    store.set('636E6667', config)

    // Check the connection after setting the config
    const connection = await Connection()
    if (!connection.isConnected) {
      return { connection: false, error: 'Database connection failed.' }
    }
    return { connection: true }
  } catch (error) {
    console.error('Error setting config:', error)
    throw new Error('Failed to set config: ' + error)
  }
})
