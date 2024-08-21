import { App, WindowRegistration } from '@shared/types'
import { AllianceManager } from './containers/MainContainer'
import allianceReducer from './store'
import { loadAllianceStoreData } from './store/initializer'
import { AllianceElectronStore } from './types/electronStore'

const AllianceRegistration: WindowRegistration = {
  windowId: App.alliance,
  isSystemWindow: false,
  initializer: loadAllianceStoreData,
  reducer: allianceReducer
}

export { AllianceManager, AllianceRegistration }
export type { AllianceElectronStore }

