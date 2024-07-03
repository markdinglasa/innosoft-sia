import { ElectronApi } from '@shared/types'
import { contextBridge } from 'electron'
import { ipcApi, sqlApi } from './bridges'
import { fnApi } from './bridges/func'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

const electronApi: ElectronApi = {
  ipc: ipcApi,
  sql: sqlApi,
  fn: fnApi,
}

contextBridge.exposeInMainWorld('electron', electronApi)
