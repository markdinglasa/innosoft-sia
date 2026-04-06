import { AppDispatch } from '@shared/types'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setManager } from '../../../store/manager'
import { useLoginMutation, useLogoutMutation } from '../api'
import { LoginProps } from '../types'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const activeUser = useSelector((state: any) => state.POS.manager.activeUser)
  const activePermissions = useSelector((state: any) => state.POS.manager.activePermissions)
  const isAuthenticated = !!activeUser

  const loginMutation = useLoginMutation()
  const logoutMutation = useLogoutMutation()

  const handleLogin = useCallback(
    async (credentials: LoginProps) => {
      try {
        const data = await loginMutation.mutateAsync(credentials)
        // Redux strictly requires all state and action payloads to be serializable.
        // IPC payload objects can contain nested un-serializable `Date` objects or class prototypes,
        // which will throw warning/errors. We serialize them safely into plain strings safely.
        const serializedUser = JSON.parse(JSON.stringify(data.user))
        const serializedTerminal = data.terminal ? JSON.parse(JSON.stringify(data.terminal)) : null
        const serializedActiveBranch = data.activeBranch ? JSON.parse(JSON.stringify(data.activeBranch)) : null
        const serializedBranches = data.branches ? JSON.parse(JSON.stringify(data.branches)) : []

        dispatch(
          setManager({
            initialize: true,
            activeUser: serializedUser,
            activePage: 'dashboard', // Default to dashboard after login
            activePermissions: data.permissions || [],
            loginDate: data.loginDate,
            activeBranches: serializedBranches,
            activeTerminal: serializedTerminal,
            activeBranch: serializedActiveBranch
          })
        )
        return data
      } catch (error: any) {
        throw error
      }
    },
    [dispatch, loginMutation]
  )

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync()
      dispatch(
        setManager({
          initialize: true,
          activeUser: null,
          activePage: 'login',
          activePermissions: [],
          loginDate: null,
          activeBranches: [],
          activeTerminal: null,
          activeBranch: null
        })
      )
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [dispatch, logoutMutation])

  const hasPermission = useCallback(
    (permission: string) => {
      return activePermissions.includes(permission)
    },
    [activePermissions]
  )

  return {
    user: activeUser,
    isAuthenticated,
    permissions: activePermissions,
    hasPermission,
    error: loginMutation?.error || logoutMutation?.error,
    login: handleLogin,
    logout: handleLogout,
    isLoading: loginMutation.isPending || logoutMutation.isPending
  }
}

