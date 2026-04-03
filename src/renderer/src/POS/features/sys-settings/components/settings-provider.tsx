import { Loader } from '@shared/components'
import { createContext, FC, ReactNode, useContext } from 'react'
import { useActiveTerminalId, useSysSettings } from '../api/sys-settings.queries'
import { TerminalActivationModal } from './terminal-activation'

interface SettingsContextType {
  // Add any context values if needed
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: activeTerminalId, isLoading: isActiveTerminalLoading } = useActiveTerminalId()
  const { data: settings, isLoading: isSettingsLoading } = useSysSettings(activeTerminalId || null)

  const isLoading = isActiveTerminalLoading || (!!activeTerminalId && isSettingsLoading)

  if (isLoading) {
    return <Loader />
  }

  return (
    <SettingsContext.Provider value={{}}>
      {children}
      {!activeTerminalId && <TerminalActivationModal />}
    </SettingsContext.Provider>
  )
}

export const useSettingsContext = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider')
  }
  return context
}
