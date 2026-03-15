import { getManager } from '@shared/selectors'
import { setActiveWindow } from '@shared/store/manager'
import { AppDataHandlers, AppDispatch, AppRegistration, SFC } from '@shared/types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SIAElectronStore, SIAManager, SIAManagerRegistration } from './App'
import { POSMainArea, POSManagerRegistration } from './POS'

export interface AppElectronStore extends SIAElectronStore {}
export const AppReducers = { 
  SIA: SIAManagerRegistration.reducer!,
  POS: POSManagerRegistration.reducer!
}
export const AppRouters: AppDataHandlers = {}
export const AppRegistrations: AppRegistration[] = [
  SIAManagerRegistration,
  POSManagerRegistration
]

export const AppMain: SFC = () => {
  const { activeWindow } = useSelector(getManager)
  const dispatch = useDispatch<AppDispatch>()
  
  useEffect(() => {
    if (!activeWindow) dispatch(setActiveWindow(SIAManagerRegistration.appId))
  }, [activeWindow, dispatch])

  return (
    <>
      <SIAManager display={activeWindow === SIAManagerRegistration.appId} />
      <POSMainArea display={activeWindow === POSManagerRegistration.appId} />
    </>
  )
}
