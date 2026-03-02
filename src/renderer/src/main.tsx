import store from '@shared/store'
import { GlobalStyle, ToastifyStyle } from '@shared/styles'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Wrapper } from './wrapper'

const Root = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <ToastifyStyle />
      <Wrapper />
    </Provider>
  )
}
createRoot(document.getElementById('root') as HTMLElement).render(<Root />)
