import { CssBaseline, ThemeProvider } from '@mui/material'
import { Loader } from "@shared/components"
import store from '@shared/store'
import { GlobalStyle, ToastifyStyle } from '@shared/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from "react"
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ScannerProvider } from './POS/providers/ScannerProvider'
import './tailwind.css'
import theme from './theme'
import Wrapper from './Wrapper'

const Root = () => {
  const queryClient = new QueryClient()

  return (
    <Provider store={store}>
      <ScannerProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <GlobalStyle />
            <ToastifyStyle />
            <Suspense fallback={
              <Loader />
            }>
              <Wrapper />
            </Suspense>
          </QueryClientProvider>
        </ThemeProvider>
      </ScannerProvider>
    </Provider>
  )
}
createRoot(document.getElementById('root') as HTMLElement).render(<Root />)
