import { LocalElectronStore, WindowDispatch } from '@shared/types'
import { ALLIANCE_MANAGER } from '../constants'
import { initialState as managerInitialSate, setManager } from './manager'

export const loadAllianceStoreData = (
  dispatch: WindowDispatch,
  store: LocalElectronStore
): void => {
  const storeManager = store?.[ALLIANCE_MANAGER] || managerInitialSate
  dispatch(setManager(storeManager))
}
