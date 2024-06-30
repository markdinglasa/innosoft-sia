import { windowRegistration } from '../../renderer/src/registry'
import { LocalElectronStore } from '../../shared/types'
import { WindowDispatch } from '../types'

export const loadWindowData = (dispatch: WindowDispatch, store: LocalElectronStore): void => {
  for (const registration of windowRegistration) {
    if (registration.hasOwnProperty('initializer')) {
      registration.initializer!(dispatch, store)
    }
  }
}
