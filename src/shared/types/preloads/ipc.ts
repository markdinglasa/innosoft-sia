import { GenericFunction, LocalElectronStore } from '@shared/types'

export interface IpcApi {
  on(channel: string, callback: GenericFunction): void
  removeListener(channel: string, callback: GenericFunction): void
  send(channel: string, payload?: any): void
  invoke<T = any>(channel: string, ...args: any[]): Promise<T>
}

export enum IpcChannel {
  clearStore = 'clear-store',
  exportStore = 'export-store-data',
  importStore = 'import-store-data',
  loadStore = 'load-store-data',
  restartApp = 'restart-application',
  setStoreValue = 'set-store-value',
  closeApp = 'close-application',
  saveFile = 'save-file',
  login = 'login',
  logout = 'logout',
  verifySession = 'verify-session',
  getSettings = 'get-settings',
  updateSettings = 'update-settings',
  activateTerminal = 'activate-terminal',
  getAvailableTerminals = 'get-available-terminals',
  getMachineFingerprint = 'get-machine-fingerprint',
  lockSession = 'lock-session',
  unlockSession = 'unlock-session',
  approveManagerAction = 'approve-manager-action',

  // Masterfile Operations
  mstList = 'mst-list',
  mstGet = 'mst-get',
  mstSave = 'mst-save',
  mstDelete = 'mst-delete',
  
  // Shift Management
  shiftOpen = 'shift-open',
  shiftClose = 'shift-close',
  shiftStatus = 'shift-status',

  // Order Management
  orderList = 'order-list',
  orderGet = 'order-get',
  orderSave = 'order-save',
  orderDelete = 'order-delete',

  // Reporting
  reportXReading = 'report-x-reading',
  reportZReading = 'report-z-reading'
}





export type SetStoreValuePayload<K extends keyof LocalElectronStore> = {
  key: K
  state: LocalElectronStore[K]
}
