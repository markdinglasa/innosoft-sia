import { ipcMain } from 'electron'
import electronStore from 'electron-store'

ipcMain.handle('set-config', async (_event, config) => {
  try {
    const store = new electronStore()
    store.set('636E6667', config)
    return true
  } catch (error) {
    console.error('Error setting config:', error)
    throw error // Rethrow the error to handle it in the renderer process if needed
  }
})

ipcMain.handle('get-config', async () => {
  try {
    const store = new electronStore()
    const config = store.get('636E6667')
    return config
  } catch (error) {
    console.error('Error getting config:', error)
    throw error // Rethrow the error to handle it in the renderer process if needed
  }
})
