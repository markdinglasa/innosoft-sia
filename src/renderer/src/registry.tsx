import { getManager } from '@shared/selectors'
import { setActiveWindow } from '@shared/store/manager'
import { AppDataHandlers, AppDispatch, AppRegistration, SFC } from '@shared/types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SIAElectronStore, SIAManager, SIAManagerRegistration } from './App'
import { Login } from './POS/components/auth'

export interface AppElectronStore extends SIAElectronStore {}
export const AppReducers = { SIA: SIAManagerRegistration.reducer! }
export const AppRouters: AppDataHandlers = {}
export const AppRegistrations: AppRegistration[] = [SIAManagerRegistration]

export const AppMain: SFC = () => {
  const { activeWindow } = useSelector(getManager)
  const dispatch = useDispatch<AppDispatch>()
  
  useEffect(() => {
    if (!activeWindow) dispatch(setActiveWindow(SIAManagerRegistration.appId))
  }, [activeWindow, dispatch])

  return (

    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/app" 
          element={
            <SIAManager display={activeWindow === SIAManagerRegistration.appId} />
          } 
        />
        {/* Redirect root to login for now */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  )
}
