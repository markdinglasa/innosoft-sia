import { App, WindowRegistration } from '@shared/types'
import { SIAManager } from './containers'
import siaManagerReducer from './store'
import { loadSIAManagerStoreData } from './store/initializer'
import { SIAElectronStore } from './types/electronStore'

const SIAManagerRegistration: WindowRegistration = {
  windowId: App.smsia,
  isSystemWindow: false,
  initializer: loadSIAManagerStoreData,
  reducer: siaManagerReducer
}

export { SIAManager, SIAManagerRegistration }
export type { SIAElectronStore }

