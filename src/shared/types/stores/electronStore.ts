import { POS_MANAGER, SYSTEM_ACCESS_TOKEN, SYSTEM_IS_LOCKED, SYSTEM_LOGIN_DATE, SYSTEM_MANAGER, SYSTEM_REFRESH_TOKEN, SYSTEM_SELF } from '@shared/constants'
import { Manager, POSManager } from '@shared/types'

export interface SystemElectronStore {
  [SYSTEM_MANAGER]: Manager
  [POS_MANAGER]?: POSManager
  [SYSTEM_SELF]?: any
  [SYSTEM_ACCESS_TOKEN]?: string
  [SYSTEM_REFRESH_TOKEN]?: string
  [SYSTEM_LOGIN_DATE]?: string
  [SYSTEM_IS_LOCKED]?: boolean
}

