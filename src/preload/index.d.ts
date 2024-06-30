import { ElectronApi } from '../shared/types/window.js'

declare global {
  interface Window {
    electron: ElectronApi
  }
}
