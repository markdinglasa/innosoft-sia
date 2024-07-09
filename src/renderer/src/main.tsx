import { Wrapper } from '@shared/containers'
import store from '@shared/store'
import { GlobalStyle, ToastifyStyle } from '@shared/styles'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
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
