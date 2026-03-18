import { Splash } from "@shared/components"
import store from '@shared/store'
import { GlobalStyle, ToastifyStyle } from '@shared/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from "react"
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './tailwind.css'
import Wrapper from './Wrapper'

const Root = () => {
  const queryClient = new QueryClient()

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <ToastifyStyle />
        <Suspense fallback={
         <Splash message="Please wait..." />
        }>
          <Wrapper />
        </Suspense>
      </QueryClientProvider>
    </Provider>
  )
}
createRoot(document.getElementById('root') as HTMLElement).render(<Root />)
