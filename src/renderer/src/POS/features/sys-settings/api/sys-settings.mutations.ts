import { ToastType, UtilityIpcChannel } from '@shared/types'
import { displayToast } from '@shared/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SysSettings } from '../types'
import { sysSettingsKeys } from './sys-settings.queries'

export const useActivateTerminal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (vars: { terminalId: number }) => {
      const response = await window.electron.ipc.invoke(
        UtilityIpcChannel.USER_TERMINAL_ACTIVATE,
        vars
      )
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to activate terminal')
      }
      return response
    },
    onSuccess: () => {
      displayToast('Terminal activated successfully!', ToastType.success)
      // Invalidate specific queries to refresh state
      queryClient.invalidateQueries({ queryKey: sysSettingsKeys.activeTerminalId() })
      // Since sysSettings depend on terminalId, which changed, we should invalidate all sys-settings query tree
      queryClient.invalidateQueries({ queryKey: sysSettingsKeys.all })
    },
    onError: (err: Error) => {
      displayToast(`Activation failed: ${err.message}`, ToastType.error)
    }
  })
}

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (vars: Partial<SysSettings>) => {
      const response = await window.electron.ipc.invoke(UtilityIpcChannel.SETTINGS_UPDATE, vars)
      if (response && !response.success) {
        throw new Error(response.message || 'Failed to update settings')
      }
      return response
    },
    onSuccess: () => {
      displayToast('Settings updated successfully!', ToastType.success)
      queryClient.invalidateQueries({ queryKey: sysSettingsKeys.all })
    },
    onError: (err: Error) => {
      displayToast(`Save failed: ${err.message}`, ToastType.error)
    }
  })
}

