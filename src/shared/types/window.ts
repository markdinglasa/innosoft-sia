import { IpcApi } from './ipc'
import { SqlApi } from './sql'

export interface ElectronApi {
  ipc: IpcApi
  sql: SqlApi
}

declare global {
  interface Window {
    electron: ElectronApi
  }
}
