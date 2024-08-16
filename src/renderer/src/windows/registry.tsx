import { getManager } from '@shared/selectors'
import { SFC, WindowDataHandlers, WindowRegistration } from '@shared/types'
import { useSelector } from 'react-redux'
import {
  SIAElectronStore,
  SIAManager,
  SIAManagerRegistration
} from './POS-SIA/registration'

export interface WindowElectronStore extends SIAElectronStore {}
export const windowReducers = {
  SIA: SIAManagerRegistration.reducer!
}
export const windowRouters: WindowDataHandlers = {}
export const windowRegistration: WindowRegistration[] = [SIAManagerRegistration]
export const Windows: SFC = () => {
  const { activeWindow } = useSelector(getManager)
  //const dispatch = useDispatch<WindowDispatch>()
  return (
    <>
      <SIAManager display={activeWindow === SIAManagerRegistration.windowId} />
    </>
  )
}
