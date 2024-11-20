import { SYSTEM_MANAGER } from '../constants'
import { initialState as managerInitialState, setManager } from '../store/manager'
import { LocalElectronStore } from '../types'

import { WindowDispatch } from '../types'

export const loadSystemData = (dispatch: WindowDispatch, store: LocalElectronStore): any => {
  const manager = store?.[SYSTEM_MANAGER] || managerInitialState
  dispatch(setManager(manager))
  return self
}
