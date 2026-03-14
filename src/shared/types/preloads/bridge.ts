import { FnApi } from './func'
import { IpcApi } from './ipc'
import { SqlApi } from './sql'

export interface UpdaterApi {
  checkForUpdates(): Promise<{ success: boolean; version?: string; message?: string }>
  downloadUpdate(): Promise<{ success: boolean; message?: string }>
  quitAndInstall(): Promise<void>
  getCurrentVersion(): Promise<string>
  onUpdateAvailable(callback: (data: any) => void): void
  onUpdateNotAvailable(callback: (data: any) => void): void
  onDownloadProgress(callback: (data: any) => void): void
  onUpdateDownloaded(callback: (data: any) => void): void
  onUpdateError(callback: (data: any) => void): void
  onChecking(callback: () => void): void
  removeAllListeners(): void
}

export interface ElectronApi {
  ipc: IpcApi
  sql: SqlApi
  fn: FnApi
  dialog: any
  updater: UpdaterApi
}

declare global {
  interface Window {
    electron: ElectronApi
  }
}
