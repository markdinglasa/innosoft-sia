
import { POS_MANAGER } from '../constants'
import { Manager } from './manager'

export interface POSElectronStore {
  [POS_MANAGER]: Manager
}