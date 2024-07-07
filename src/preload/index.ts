import { ElectronApi } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'
import { ipcApi, sqlApi } from './bridges'
import { fnApi } from './bridges/func'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

const electronApi: ElectronApi = {
  ipc: ipcApi,
  sql: sqlApi,
  fn: fnApi,
  dialog: {
    showOpenDialog: async (options: Electron.OpenDialogOptions) => {
      return await ipcRenderer.invoke('show-open-dialog', options)
    }
  }
}

contextBridge.exposeInMainWorld('electron', electronApi)
