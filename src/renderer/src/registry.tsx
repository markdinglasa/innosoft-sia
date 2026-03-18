import { getManager } from '@shared/selectors'
import { setActiveWindow } from '@shared/store/manager'
import { AppDataHandlers, AppDispatch, AppRegistration, SFC } from '@shared/types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { POSMainArea, POSManagerRegistration } from './POS'

export interface AppElectronStore  {}
export const AppReducers = { 

  POS: POSManagerRegistration.reducer!
}
export const AppRouters: AppDataHandlers = {}
export const AppRegistrations: AppRegistration[] = [

  POSManagerRegistration
]

export const AppMain: SFC = () => {
  const { activeWindow } = useSelector(getManager)
  const dispatch = useDispatch<AppDispatch>()
  
  useEffect(() => {
    if (!activeWindow) dispatch(setActiveWindow(POSManagerRegistration.appId))
  }, [activeWindow, dispatch])

  return (
    <>
      <POSMainArea display={activeWindow === POSManagerRegistration.appId} />
    </>
  )
}
