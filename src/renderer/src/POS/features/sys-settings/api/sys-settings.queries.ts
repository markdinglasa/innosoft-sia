import { useQuery } from '@tanstack/react-query'
import { UtilityIpcChannel, MasterfileIpcChannel } from '@shared/types'
import { SysSettings } from '../types'

export const sysSettingsKeys = {
  all: ['sys-settings'] as const,
  fingerprint: () => [...sysSettingsKeys.all, 'fingerprint'] as const,
  activeTerminalId: () => [...sysSettingsKeys.all, 'active-terminal-id'] as const,
  availableTerminals: () => [...sysSettingsKeys.all, 'available-terminals'] as const,
  mergedSettings: (terminalId: number | null) => [...sysSettingsKeys.all, 'merged', terminalId] as const,
}

export const useTerminalFingerprint = () => {
  return useQuery({
    queryKey: sysSettingsKeys.fingerprint(),
    queryFn: async () => {
      return await window.electron.ipc.invoke(UtilityIpcChannel.USER_TERMINAL_FINGERPRINT) as string
    },
    staleTime: Infinity, // Fingerprint should not change
  })
}

export const useActiveTerminalId = () => {
  return useQuery({
    queryKey: sysSettingsKeys.activeTerminalId(),
    queryFn: async () => {
      const response = await window.electron.ipc.invoke(UtilityIpcChannel.USER_TERMINAL_GET_ACTIVE)
      return response as number | null
    },
  })
}

export const useAvailableTerminals = () => {
  return useQuery({
    queryKey: sysSettingsKeys.availableTerminals(),
    queryFn: async () => {
      const response = await window.electron.ipc.invoke(MasterfileIpcChannel.TERMINAL_LIST, {
        take: 100
      })
      return response?.data || []
    },
  })
}

export const useSysSettings = (terminalId: number | null) => {
  return useQuery({
    queryKey: sysSettingsKeys.mergedSettings(terminalId),
    queryFn: async () => {
      if (!terminalId) return null
      const response = await window.electron.ipc.invoke(UtilityIpcChannel.SETTINGS_GET_MERGED, terminalId)
      return response as SysSettings
    },
    enabled: !!terminalId,
  })
}
