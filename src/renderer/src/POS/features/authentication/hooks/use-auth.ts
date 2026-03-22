import { AppDispatch } from '@shared/types'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setManager } from '../../../store/manager'
import { login as apiLogin, logout as apiLogout } from '../api/auth-api'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const activeUser = useSelector((state: any) => state.POS.manager.activeUser)
  const isAuthenticated = !!activeUser

  const handleLogin = useCallback(async (credentials: any) => {
    try {
      const data = await apiLogin(credentials)
      console.log('data:', data)
      dispatch(setManager({
        initialize: true,
        activeUser: data.user,
        activePage: 'dashboard' // Default to dashboard after login
      }))
      return data
    } catch (error) {
      throw error
    }
  }, [dispatch])

  const handleLogout = useCallback(async () => {
    await apiLogout()
    dispatch(setManager({
      initialize: true,
      activeUser: null,
      activePage: 'login'
    }))
  }, [dispatch])

  return {
    user: activeUser,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout
  }
}
