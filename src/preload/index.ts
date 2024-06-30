import { ElectronApi } from '@shared/types'
import { contextBridge } from 'electron'
import { ipcApi, sqlApi } from './bridges'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

const electronApi: ElectronApi = {
  ipc: ipcApi,
  sql: sqlApi
}

contextBridge.exposeInMainWorld('electron', electronApi)
