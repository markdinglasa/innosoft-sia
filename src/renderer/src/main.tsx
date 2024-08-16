import store from '@shared/store'
import { GlobalStyle, ToastifyStyle } from '@shared/styles'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { Wrapper } from './Wrapper'
const Root = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <ToastifyStyle />
      <Wrapper />
    </Provider>
  )
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />)
