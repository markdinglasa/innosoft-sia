import { SYSTEM_MANAGER, SYSTEM_SELF, SYSTEM_ACCESS_TOKEN, SYSTEM_REFRESH_TOKEN } from '@shared/constants'
import { Manager } from '@shared/types'

export interface SystemElectronStore {
  [SYSTEM_MANAGER]: Manager
  [SYSTEM_SELF]?: any
  [SYSTEM_ACCESS_TOKEN]?: string
  [SYSTEM_REFRESH_TOKEN]?: string
}
