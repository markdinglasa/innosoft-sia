import { AppRegistration } from '@shared/types'
import { RootPage } from './app/page'
import { POS_MANAGER } from './constants'
import posManagerReducer from './store'
import { loadPOSManagerStoreData } from './store/initializer'
import { POSElectronStore } from "./types"

const POSManagerRegistration: AppRegistration = {
  appId: POS_MANAGER,
  isSystemApp: false,
  initializer: loadPOSManagerStoreData,
  reducer: posManagerReducer
}

export { POSManagerRegistration, RootPage }
export type { POSElectronStore }

