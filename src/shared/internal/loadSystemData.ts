import { SYSTEM_MANAGER } from '../constants'
import { initialState as managerInitialState, setManager } from '../store/manager'
import { AppDispatch, LocalElectronStore } from '../types'

export const loadSystemData = (dispatch: AppDispatch, store: LocalElectronStore): any => {
  const manager = store?.[SYSTEM_MANAGER] || managerInitialState
  dispatch(setManager(manager))
  return self
}
