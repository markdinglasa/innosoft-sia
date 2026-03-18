import { IpcChannel, LocalElectronStore, SetStoreValuePayload } from '@shared/types'
import { getFailChannel, getSuccessChannel } from '@shared/utils/ipc'
import { OpenDialogOptions, SaveDialogOptions, dialog, ipcMain } from 'electron'
import fs from 'fs'
import { isQuitting, mainWindow } from '../'
import Store from '../store/Store'

ipcMain.on(IpcChannel.clearStore, (event) => {
  try {
    Store.clear()
    event.reply(getSuccessChannel(IpcChannel.clearStore))
  } catch (error: any) {
    console.log('Failed to clear store', error)
    event.reply(getFailChannel(IpcChannel.clearStore), error.toString())
  }
})

ipcMain.on(IpcChannel.exportStore, async (event) => {
  const options: SaveDialogOptions = {
    buttonLabel: 'Export',
    defaultPath: 'store-data.json',
    filters: [
      { extensions: ['json'], name: 'json' },
      { extensions: ['*'], name: 'All Files' }
    ],
    title: 'Export Store Data'
  }
  try {
    const { canceled, filePath } = await dialog.showSaveDialog(options)
    if (canceled || !filePath) return
    const data = JSON.stringify(Store.getStore())
    fs.writeFileSync(filePath, data)
    event.reply(getSuccessChannel(IpcChannel.exportStore))
  } catch (error: any) {
    console.log(`Failed to save file: ${IpcChannel.exportStore}`, error)
    event.reply(getFailChannel(IpcChannel.exportStore), error.toString())
  }
})

ipcMain.on(IpcChannel.importStore, async (event) => {
  const options: OpenDialogOptions = {
    buttonLabel: 'Import',
    filters: [
      { extensions: ['json'], name: 'json' },
      { extensions: ['*'], name: 'All Files' }
    ],
    title: 'Import Store Data'
  }
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog(options)
    if (canceled || !filePaths.length) return
    const filePath = filePaths[0]
    fs.readFile(filePath, 'utf-8', (err, jsonData) => {
      if (err) {
        throw err
      }

      const data = JSON.parse(jsonData)
      if (data.__internal__) {
        delete data.__internal__
      }
      Store.clear()
      Store.setStore(data)
      event.reply(getSuccessChannel(IpcChannel.importStore), data)
    })
  } catch (error: any) {
    console.log(`Failed to read file: ${IpcChannel.importStore}`, error)
    event.reply(getFailChannel(IpcChannel.importStore), error.toString())
  }
})
ipcMain.on(IpcChannel.loadStore, (event) => {
  try {
    const state = Store.getStore()
    event.reply(getSuccessChannel(IpcChannel.loadStore), state)
  } catch (error: any) {
    console.log(`Failed to load store`, error)
    event.reply(getFailChannel(IpcChannel.loadStore), error.toString())
  }
})
ipcMain.on(
  IpcChannel.setStoreValue,
  (event, { key, state }: SetStoreValuePayload<keyof LocalElectronStore>) => {
    try {
      Store.set(key, state)
      event.reply(getSuccessChannel(IpcChannel.setStoreValue))
    } catch (error: any) {
      console.log(`Failed to set Store of key ${key}`, error)
      event.reply(getFailChannel(IpcChannel.setStoreValue), error.toString())
    }
  }
)
ipcMain.on(IpcChannel.closeApp, (event) => {
  try {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
  } catch (error: any) {
    console.log('Failed to restart app', error)
    setTimeout(() => {
      event.reply(getFailChannel(IpcChannel.restartApp), error.toString())
    }, 1000)
  }
})

ipcMain.handle(IpcChannel.login, async (_event, credentials) => {
  const { username, password } = credentials
  // Mock authentication logic - replace with actual DB check if needed
  if (username === 'admin' && password === 'admin') {
    return {
      success: true,
      data: {
        user: { id: 1, name: 'Admin User', username: 'admin', role: 'admin' },
        token: 'mock-jwt-token'
      }
    }
  }
  return { success: false, message: 'Invalid username or password' }
})

ipcMain.handle(IpcChannel.logout, async () => {
  return { success: true }
})

ipcMain.handle(IpcChannel.verifySession, async () => {
  // Mock session verification
  return { 
    success: true, 
    data: { 
      user: { id: 1, name: 'Admin User', username: 'admin', role: 'admin' } 
    } 
  }
})
