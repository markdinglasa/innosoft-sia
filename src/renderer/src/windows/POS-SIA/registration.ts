import { WindowRegistration } from '@shared/types'
import { SIA_MANAGER } from './constants'
import { SIAManager } from './containers'
import siaManagerReducer from './store'
import { loadSIAManagerStoreData } from './store/initializer'
import { SIAElectronStore } from './types/electronStore'

const SIAManagerRegistration: WindowRegistration = {
  windowId: SIA_MANAGER,
  isSystemWindow: false,
  initializer: loadSIAManagerStoreData,
  reducer: siaManagerReducer
}

export { SIAManager, SIAManagerRegistration }
export type { SIAElectronStore }
