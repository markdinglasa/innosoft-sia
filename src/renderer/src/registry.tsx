import { getManager } from '@shared/selectors'
import { SFC, WindowDispatch } from '@shared/types'
import { WindowDataHandlers, WindowRegistration } from '@shared/types/windows'
import { useDispatch, useSelector } from 'react-redux'

import { setActiveWindow } from '@shared/store/manager'
import { useEffect } from 'react'
import {
  SIAElectronStore,
  SIAManager,
  SIAManagerRegistration
} from './windows/POS-SIA/registration'

export interface WindowElectronStore extends SIAElectronStore {}

export const windowReducers = {
  SIA: SIAManagerRegistration.reducer!
}
export const windowRouters: WindowDataHandlers = { }

export const windowRegistration: WindowRegistration[] = [SIAManagerRegistration]

//export const windowRouters: WindowDataHandlers = {}
export const Windows: SFC = () => {
  const { activeWindow } = useSelector(getManager)
  const dispatch = useDispatch<WindowDispatch>()

  useEffect(() => {
    if (!activeWindow) {
      dispatch(setActiveWindow(SIAManagerRegistration.windowId))
    }
  }, [activeWindow, dispatch])
  return (
    <>
      <SIAManager display={activeWindow === SIAManagerRegistration.windowId} />
    </>
  )
}
