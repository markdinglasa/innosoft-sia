import { app, ipcMain } from 'electron'
import log from 'electron-log'
import { autoUpdater, UpdateInfo } from 'electron-updater'
import { mainWindow } from './'

// Configure logging
autoUpdater.logger = log
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

// Send status updates to the renderer
function sendUpdateStatus(channel: string, data?: any): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, data)
  }
}

// --- autoUpdater event listeners ---

autoUpdater.on('checking-for-update', () => {
  sendUpdateStatus('updater:checking')
})

autoUpdater.on('update-available', (info: UpdateInfo) => {
  sendUpdateStatus('updater:update-available', {
    version: info.version,
    releaseDate: info.releaseDate,
    releaseNotes: info.releaseNotes
  })
})

autoUpdater.on('update-not-available', (info: UpdateInfo) => {
  sendUpdateStatus('updater:update-not-available', {
    version: info.version
  })
})

autoUpdater.on('download-progress', (progress) => {
  sendUpdateStatus('updater:download-progress', {
    percent: Math.round(progress.percent),
    transferred: progress.transferred,
    total: progress.total,
    bytesPerSecond: progress.bytesPerSecond
  })
})

autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
  sendUpdateStatus('updater:update-downloaded', {
    version: info.version
  })
})

autoUpdater.on('error', (error: Error) => {
  sendUpdateStatus('updater:error', {
    message: error.message
  })
})

// --- IPC handlers ---

ipcMain.handle('updater:check-for-updates', async () => {
  try {
    const result = await autoUpdater.checkForUpdates()
    return { success: true, version: result?.updateInfo?.version }
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message }
  }
})

ipcMain.handle('updater:download-update', async () => {
  try {
    await autoUpdater.downloadUpdate()
    return { success: true }
  } catch (error: unknown) {
    return { success: false, message: (error as Error).message }
  }
})

ipcMain.handle('updater:quit-and-install', () => {
  autoUpdater.quitAndInstall()
})

ipcMain.handle('updater:get-current-version', () => {
  return app.getVersion()
})
