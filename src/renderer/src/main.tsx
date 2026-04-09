import { CssBaseline, ThemeProvider } from '@mui/material'
import { Loader } from '@shared/components'
import store from '@shared/store'
import { GlobalStyle, ToastifyStyle } from '@shared/styles'
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import { Suspense, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { NotificationProvider } from './POS/components/providers/notification-provider'
import { ScannerProvider } from './POS/providers/ScannerProvider'
import './tailwind.css'
import theme from './theme'
import Wrapper from './Wrapper'
import { setActiveUser } from './POS/store/manager'
import { displayToast } from '@shared/utils'
import { ToastType, IpcChannel } from '@shared/types'
import { useState } from 'react'
import { SessionExpiredDialog } from './POS/components/feedback'

const Root = () => {
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false)

  /**
   * Centralized Authentication Error Handler.
   * Forces logout and redirection to login when session expires.
   */
  const handleAuthError = (error: any) => {
    const errorMsg = error.message || ''
    const isUnauthorized = 
      errorMsg.includes('expired') || 
      errorMsg.toLowerCase().includes('unauthorized') || 
      errorMsg.includes('token') ||
      error.isUnauthorized === true // Custom flag from our auth-middleware

    if (isUnauthorized && !sessionExpiredOpen) {
      // 1. Show the expiration dialog
      setSessionExpiredOpen(true)

      // 2. Force state reset to trigger redirection to login
      store.dispatch(setActiveUser(null))

      // 3. Proactively clear tokens and session data in the main process
      window.electron.ipc.invoke(IpcChannel.logout)
    }
  }

  const queryClient = useMemo(() => new QueryClient({
    queryCache: new QueryCache({
      onError: handleAuthError
    }),
    mutationCache: new MutationCache({
      onError: handleAuthError
    }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          // Do not retry on unauthorized errors
          const errorMsg = error.message || ''
          if (errorMsg.includes('expired') || errorMsg.toLowerCase().includes('unauthorized')) return false
          return failureCount < 3
        }
      }
    }
  }), [])

  return (
    <Provider store={store}>
      <ScannerProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <GlobalStyle />
            <ToastifyStyle />
            <Suspense fallback={<Loader />}>
              <NotificationProvider>
                <Wrapper />
                <SessionExpiredDialog 
                  open={sessionExpiredOpen} 
                  onClose={() => setSessionExpiredOpen(false)} 
                />
              </NotificationProvider>
            </Suspense>
          </QueryClientProvider>
        </ThemeProvider>
      </ScannerProvider>
    </Provider>
  )
}
createRoot(document.getElementById('root') as HTMLElement).render(<Root />)

