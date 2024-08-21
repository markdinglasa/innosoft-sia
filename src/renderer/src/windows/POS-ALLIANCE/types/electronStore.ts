import { Manager } from '.'
import { ALLIANCE_MANAGER } from '../constants'

export interface AllianceElectronStore {
  [ALLIANCE_MANAGER]: Manager
}
