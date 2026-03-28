import { AppDispatch } from '@shared/types'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AuthUser, LoginProps } from '../types'
import { setManager } from '../../../store/manager'
import { useLoginMutation, useLogoutMutation } from '../api'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const activeUser = useSelector((state: any) => state.POS.manager.activeUser)
  const activePermissions = useSelector((state: any) => state.POS.manager.activePermissions)
  const isAuthenticated = !!activeUser

  const loginMutation = useLoginMutation()
  const logoutMutation = useLogoutMutation()

  const handleLogin = useCallback(async (credentials: LoginProps) => {
    try {
      const data = await loginMutation.mutateAsync(credentials)
      dispatch(setManager({
        initialize: true,
        activeUser: data.user,
        activePage: 'dashboard', // Default to dashboard after login
        activePermissions: data.permissions || [],
        loginDate: data.loginDate
      }))
      return data
    } catch (error: any) {
      throw error
    }
  }, [dispatch, loginMutation])

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync()
      dispatch(setManager({
        initialize: true,
        activeUser: null,
        activePage: 'login',
        activePermissions: [],
        loginDate: null
      }))
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [dispatch, logoutMutation])

  const hasPermission = useCallback((permission: string) => {
    return activePermissions.includes(permission)
  }, [activePermissions])

  return {
    user: activeUser,
    isAuthenticated,
    permissions: activePermissions,
    hasPermission,
    login: handleLogin,
    logout: handleLogout,
    isLoading: loginMutation.isPending || logoutMutation.isPending
  }
}
