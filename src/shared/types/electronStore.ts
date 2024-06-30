import { SYSTEM_MANAGER } from '../constants'
import { Manager } from '../interfaces/manager'

export interface SystemElectronStore {
  [SYSTEM_MANAGER]: Manager
}
