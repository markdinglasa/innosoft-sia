import { AppDispatch, LocalElectronStore } from '@shared/types'
import { SIA_MANAGER } from '../constants'
import { initialState as managerInitialSate, setManager } from './manager'

export const loadSIAManagerStoreData = (dispatch: AppDispatch, store: LocalElectronStore): void => {
  const storeManager = store?.[SIA_MANAGER] || managerInitialSate
  dispatch(setManager(storeManager))
}
