import { MainArea } from '@renderer/MainArea'
import { ErrorBoundary, Snackbar as CSnackbar } from '@shared/components/'
import { useReadIpc } from '@shared/hooks'
import { loadSystemData, loadWindowData } from '@shared/internal'
import { getSnackbar, getStoreLoaded } from '@shared/selectors/state'
import { setStoreLoadedTrue } from '@shared/store/internal'
import { setSnackbar } from '@shared/store/manager'
import {
  AppDispatch,
  GenericVoidFunction,
  IpcChannel,
  LocalElectronStore,
  ToastType
} from '@shared/types'
import { loadStoreFailToast } from '@shared/utils'
import { FC, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bounce, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as S from './Styles'

export const Wrapper: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const storeLoaded = useSelector(getStoreLoaded)
  const snackbar = useSelector(getSnackbar)

  const loadStoreSuccessCallback = useCallback(
    (store: LocalElectronStore) => {
      if (storeLoaded) return
      loadSystemData(dispatch, store)
      loadWindowData(dispatch, store)
      dispatch(setStoreLoadedTrue())
    },
    [dispatch, storeLoaded]
  )

  const loadStoreData = useReadIpc({
    channel: IpcChannel.loadStore,
    failCallback: loadStoreFailToast as GenericVoidFunction,
    successCallback: loadStoreSuccessCallback as GenericVoidFunction
  })

  useEffect(() => {
    if (!storeLoaded) {
      loadStoreData()
    }
  }, [loadStoreData, storeLoaded])

  const handleCloseSnackbar = () => {
    dispatch(
      setSnackbar({
        display: false,
        message: '',
        type: ToastType.error
      })
    )
  }

  const Snackbar = () => {
    if (snackbar?.display)
      return (
        <CSnackbar message={snackbar.message} type={snackbar.type} onClose={handleCloseSnackbar} />
      )
    return null
  }

  return (
    <S.Wrapper>
      <ErrorBoundary>
        <MainArea />
        <Snackbar />
        <ToastContainer
          autoClose={3000}
          closeOnClick
          draggable
          hideProgressBar
          newestOnTop
          pauseOnFocusLoss
          pauseOnHover
          position="bottom-left"
          rtl={false}
          transition={Bounce}
        />
      </ErrorBoundary>
    </S.Wrapper>
  )
}

