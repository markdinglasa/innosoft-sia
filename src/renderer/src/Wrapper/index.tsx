import { MainArea } from '@renderer/MainArea'
import { useSocketNotifications } from '@renderer/POS/hooks'
import { useReadIpc } from '@shared/hooks'
import { loadSystemData, loadWindowData } from '@shared/internal'
import { getStoreLoaded } from '@shared/selectors/state'
import { setStoreLoadedTrue } from '@shared/store/internal'
import {
  AppDispatch,
  GenericVoidFunction,
  IpcChannel,
  LocalElectronStore
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

  useSocketNotifications()

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

  return (
    <S.Wrapper>
      <MainArea />
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
    </S.Wrapper>
  )
}
