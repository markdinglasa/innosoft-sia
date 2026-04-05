import { AppDispatch, LocalElectronStore } from '@shared/types'
import { POS_MANAGER } from '../constants'
import { initialState as managerInitialState, setManager } from './manager'

export const loadPOSManagerStoreData = (dispatch: AppDispatch, store: LocalElectronStore): void => {
  const storeManager = store?.[POS_MANAGER] || managerInitialState

  dispatch(
    setManager({
      ...storeManager,
      activeBranches: [],
      activeTerminal: null
    })
  )
}

