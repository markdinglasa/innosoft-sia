import { Manager } from '.'
import { SIA_MANAGER } from '../constants'

export interface SIAElectronStore {
  [SIA_MANAGER]: Manager
}
