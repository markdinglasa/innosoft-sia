import { AppRegistration } from '@shared/types'
import { SIA_MANAGER } from './constants'

import siaManagerReducer from './store'
import { loadSIAManagerStoreData } from './store/initializer'

const SIAManagerRegistration: AppRegistration = {
  appId: SIA_MANAGER,
  isSystemApp: false,
  initializer: loadSIAManagerStoreData,
  reducer: siaManagerReducer
}

export { SIAManager } from './containers'
export { type SIAElectronStore } from './types/electronStore'
export { SIAManagerRegistration }
