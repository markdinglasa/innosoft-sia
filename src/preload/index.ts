import { ElectronApi, UpdaterApi } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'
import { ipcApi, sqlApi } from './bridges'
import { fnApi } from './bridges/func'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

const updaterApi: UpdaterApi = {
  checkForUpdates: () => ipcRenderer.invoke('updater:check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('updater:download-update'),
  quitAndInstall: () => ipcRenderer.invoke('updater:quit-and-install'),
  getCurrentVersion: () => ipcRenderer.invoke('updater:get-current-version'),
  onUpdateAvailable: (callback) => {
    ipcRenderer.on('updater:update-available', (_event, data) => callback(data))
  },
  onUpdateNotAvailable: (callback) => {
    ipcRenderer.on('updater:update-not-available', (_event, data) => callback(data))
  },
  onDownloadProgress: (callback) => {
    ipcRenderer.on('updater:download-progress', (_event, data) => callback(data))
  },
  onUpdateDownloaded: (callback) => {
    ipcRenderer.on('updater:update-downloaded', (_event, data) => callback(data))
  },
  onUpdateError: (callback) => {
    ipcRenderer.on('updater:error', (_event, data) => callback(data))
  },
  onChecking: (callback) => {
    ipcRenderer.on('updater:checking', () => callback())
  },
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('updater:update-available')
    ipcRenderer.removeAllListeners('updater:update-not-available')
    ipcRenderer.removeAllListeners('updater:download-progress')
    ipcRenderer.removeAllListeners('updater:update-downloaded')
    ipcRenderer.removeAllListeners('updater:error')
    ipcRenderer.removeAllListeners('updater:checking')
  }
}

const electronApi: ElectronApi = {
  ipc: ipcApi,
  sql: sqlApi,
  fn: fnApi,
  dialog: {
    showOpenDialog: async (options: Electron.OpenDialogOptions) => {
      return await ipcRenderer.invoke('show-open-dialog', options)
    },
    openFolder: async (path: string) => {
      return await ipcRenderer.invoke('open-folder', path)
    }
  },
  updater: updaterApi
}

contextBridge.exposeInMainWorld('electron', electronApi)
