import { FnApi } from './func'
import { IpcApi } from './ipc'
import { SqlApi } from './sql'

export interface ElectronApi {
  ipc: IpcApi
  sql: SqlApi
  fn: FnApi
  dialog: any
}

declare global {
  interface Window {
    electron: ElectronApi
  }
}
