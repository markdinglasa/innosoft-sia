import { SYSTEM_MANAGER, SYSTEM_SELF } from '@shared/constants'
import { Manager } from '@shared/types'

export interface SystemElectronStore {
  [SYSTEM_MANAGER]: Manager
  [SYSTEM_SELF]?: any
}
