import { IpcChannel, LocalElectronStore, Response, SetStoreValuePayload } from '@shared/types'
import { getFailChannel, getSuccessChannel } from '@shared/utils/ipc'
import { OpenDialogOptions, SaveDialogOptions, dialog, ipcMain } from 'electron'
import fs from 'fs'
import { isQuitting, mainWindow } from '../'
import { databaseService } from '../services/database.service'
import Store from '../store/Store'
import { AuthService } from '../services/auth.services/auth.service'

const authService = new AuthService()

ipcMain.handle('sync-database-schema', async (): Promise<Response> => {
  try {
    const result = await databaseService.syncSchema()
    return { IsSomething: result.success, Message: result.message }
  } catch (error: any) {
    return { IsSomething: false, Message: error.message || 'Failed to sync database schema' }
  }
})

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
  const { username, password, loginDate } = credentials
  try {
    const result = await authService.login(username, password, loginDate)
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, message: error.message || 'Login failed' }
  }
})

ipcMain.handle(IpcChannel.logout, async () => {
  try {
    await authService.logout()
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message || 'Logout failed' }
  }
})

ipcMain.handle(IpcChannel.verifySession, async () => {
  try {
    const payload = await authService.validateAccessToken()
    const user = await authService.currentUser(payload.userId)
    return { success: true, data: { user } }
  } catch (error: any) {
    return { success: false, message: error.message || 'Session verification failed' }
  }
})

ipcMain.handle(IpcChannel.lockSession, async () => {
  try {
    await authService.lockSession()
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message || 'Lock failed' }
  }
})

ipcMain.handle(IpcChannel.unlockSession, async (_event, { password }) => {
  try {
    const success = await authService.unlockSession(password)
    return { success }
  } catch (error: any) {
    return { success: false, message: error.message || 'Unlock failed' }
  }
})

ipcMain.handle(IpcChannel.approveManagerAction, async (_event, { username, password }) => {
  try {
    const success = await authService.verifyManagerOverride(username, password)
    return { success }
  } catch (error: any) {
    return { success: false, message: error.message || 'Approval failed' }
  }
})
