import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UtilityIpcChannel } from '@shared/types'
import { sysSettingsKeys } from './sys-settings.queries'
import { toast } from 'react-toastify'
import { SysSettings } from '../types'

export const useActivateTerminal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (vars: { terminalId: number, fingerprint: string }) => {
      const response = await window.electron.ipc.invoke(UtilityIpcChannel.USER_TERMINAL_ACTIVATE, vars)
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to activate terminal')
      }
      return response
    },
    onSuccess: () => {
      toast.success('Terminal activated successfully!')
      // Invalidate specific queries to refresh state
      queryClient.invalidateQueries({ queryKey: sysSettingsKeys.activeTerminalId() })
      // Since sysSettings depend on terminalId, which changed, we should invalidate all sys-settings query tree
      queryClient.invalidateQueries({ queryKey: sysSettingsKeys.all })
    },
    onError: (err: Error) => {
      toast.error(`Activation failed: ${err.message}`)
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
      toast.success('Settings updated successfully!')
      queryClient.invalidateQueries({ queryKey: sysSettingsKeys.all })
    },
    onError: (err: Error) => {
      toast.error(`Save failed: ${err.message}`)
    }
  })
}
