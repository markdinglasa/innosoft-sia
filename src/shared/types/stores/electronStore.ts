import { SYSTEM_MANAGER } from '@shared/constants'
import { Manager } from '@shared/types'

export interface SystemElectronStore {
  [SYSTEM_MANAGER]: Manager
}
