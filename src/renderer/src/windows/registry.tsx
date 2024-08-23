import { getActiveWindow } from '@shared/selectors'
import { SFC, WindowDataHandlers, WindowRegistration } from '@shared/types'
import { useSelector } from 'react-redux'
import {
  AllianceElectronStore,
  AllianceManager,
  AllianceRegistration
} from './POS-ALLIANCE/registration'
import {
  SIAElectronStore,
  SIAManager,
  SIAManagerRegistration
} from './POS-SIA/registration'
import { SelectorForm } from './WindowSelector'

export interface WindowElectronStore extends SIAElectronStore, AllianceElectronStore {}
export const windowReducers = {
  SIA: SIAManagerRegistration.reducer!,
  Alliance: AllianceRegistration.reducer!
}

export const windowRouters: WindowDataHandlers = {}
export const windowRegistration: WindowRegistration[] = [SIAManagerRegistration, AllianceRegistration]
export const Windows: SFC = () => {
  const activeWindow  = useSelector(getActiveWindow)
  return (
    <>
      <SelectorForm display={activeWindow === null} />
      <SIAManager display={activeWindow === SIAManagerRegistration.windowId} />
      <AllianceManager display={activeWindow === AllianceRegistration.windowId} />
    </>
  )
}
