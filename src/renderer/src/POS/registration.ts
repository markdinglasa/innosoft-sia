import { AppRegistration } from '@shared/types'
import { POS_MANAGER } from './constants'
import { POSMainArea } from './MainArea'
import posManagerReducer from './store'
import { loadPOSManagerStoreData } from './store/initializer'

const POSManagerRegistration: AppRegistration = {
  appId: POS_MANAGER,
  isSystemApp: false,
  initializer: loadPOSManagerStoreData,
  reducer: posManagerReducer
}

export { POSMainArea, POSManagerRegistration }
