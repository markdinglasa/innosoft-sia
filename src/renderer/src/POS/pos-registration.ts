import { AppRegistration } from '@shared/types'
import { POS_MANAGER } from './constants'
import { POSMainArea } from './pos-main-area'
import posManagerReducer from './store'
import { loadPOSManagerStoreData } from './store/initializer'
import { POSElectronStore } from "./types"

const POSManagerRegistration: AppRegistration = {
  appId: POS_MANAGER,
  isSystemApp: false,
  initializer: loadPOSManagerStoreData,
  reducer: posManagerReducer
}

export { POSMainArea, POSManagerRegistration }
export type { POSElectronStore }

