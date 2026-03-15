import store from '@shared/store'
import { GlobalStyle, ToastifyStyle } from '@shared/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './tailwind.css'
import { Wrapper } from './Wrapper'

const Root = () => {
  const queryClient = new QueryClient()

  return (
    <Provider store={store}>c
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <ToastifyStyle />
        <Wrapper />
      </QueryClientProvider>
    </Provider>
  )
}
createRoot(document.getElementById('root') as HTMLElement).render(<Root />)
