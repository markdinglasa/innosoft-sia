import { AppDispatch, LocalElectronStore } from '@shared/types'
import { SIA_MANAGER, SIA_SETTINGS } from '../constants'
import { settingsInitial } from '../types'
import { initialState as managerInitialSate, setManager } from './manager'
import { setSettings } from './settings'

export const loadSIAManagerStoreData = (dispatch: AppDispatch, store: LocalElectronStore): void => {
  const storeManager = store?.[SIA_MANAGER] || managerInitialSate
  const storeSettings = store?.[SIA_SETTINGS] || settingsInitial

  dispatch(setManager(storeManager))
  dispatch(setSettings(storeSettings))
}
