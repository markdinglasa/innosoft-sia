import { AppDispatch } from '@shared/types'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setManager } from '../../../store/manager'
import { useLoginMutation, useLogoutMutation } from '../api'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const activeUser = useSelector((state: any) => state.POS.manager.activeUser)
  const isAuthenticated = !!activeUser

  const loginMutation = useLoginMutation()
  const logoutMutation = useLogoutMutation()

  const handleLogin = useCallback(async (credentials: any) => {
    try {
      const data = await loginMutation.mutateAsync(credentials)
      dispatch(setManager({
        initialize: true,
        activeUser: data.user,
        activePage: 'dashboard' // Default to dashboard after login
      }))
      return data
    } catch (error) {
      throw error
    }
  }, [dispatch, loginMutation])

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync()
      dispatch(setManager({
        initialize: true,
        activeUser: null,
        activePage: 'login'
      }))
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [dispatch, logoutMutation])

  return {
    user: activeUser,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    isLoading: loginMutation.isPending || logoutMutation.isPending
  }
}
