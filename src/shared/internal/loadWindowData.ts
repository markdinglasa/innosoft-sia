import { AppRegistrations } from '../../renderer/src/registry'
import { LocalElectronStore } from '../../shared/types'
import { AppDispatch } from '../types'

export const loadWindowData = (dispatch: AppDispatch, store: LocalElectronStore): void => {
  for (const registration of AppRegistrations) {
    if (registration.hasOwnProperty('initializer')) {
      registration.initializer!(dispatch, store)
    }
  }
}
