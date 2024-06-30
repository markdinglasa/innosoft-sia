import { GenericFunction } from './generic'
import { LocalElectronStore } from './localElectronStore'

export interface IpcApi {
  on(channel: string, callback: GenericFunction): void
  removeListener(channel: string, callback: GenericFunction): void
  send(channel: string, payload?: any): void
}

export enum IpcChannel {
  clearStore = 'clear-store',
  exportStore = 'export-store-data',
  importStore = 'import-store-data',
  loadStore = 'load-store-data',
  restartApp = 'restart-application',
  setStoreValue = 'set-store-value',
  closeApp = 'close-application'
}

export type SetStoreValuePayload<K extends keyof LocalElectronStore> = {
  key: K
  state: LocalElectronStore[K]
}
