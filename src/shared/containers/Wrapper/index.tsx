import { WelcomeModal } from '@shared/modals'
import { setStoreLoadedTrue } from '@shared/store/internal'
import { IpcChannel, LocalElectronStore, WindowDispatch } from '@shared/types'
import { loadStoreFailToast } from '@shared/utils/toast'
import { FC, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Flip, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useReadIpc, useToggle } from '../../hooks'
import { loadWindowData } from '../../internal'
import { getStoreLoaded } from '../../selectors'
import { Layout } from '../Layout'

export const Wrapper: FC = () => {
  const [welcomeModalIsOpen, toggleWelcomeModal] = useToggle(false)
  const dispatch = useDispatch<WindowDispatch>()
  const storeLoaded = useSelector(getStoreLoaded)

  const loadStoreSuccessCallback = useCallback(
    (store: LocalElectronStore) => {
      if (storeLoaded) return

      //const storeSelf = loadSystemData(dispatch, store)
      loadWindowData(dispatch, store)
      dispatch(setStoreLoadedTrue())
    },
    [dispatch, storeLoaded, toggleWelcomeModal]
  )

  const loadStoreData = useReadIpc({
    channel: IpcChannel.loadStore,
    failCallback: loadStoreFailToast,
    successCallback: loadStoreSuccessCallback
  })

  useEffect(() => {
    loadStoreData()
  }, [loadStoreData])

  /*const renderLayout = (): ReactNode => {
    if (!storeLoaded) return null
    return <Layout />
  }*/

  return (
    <>
      <Layout />
      <ToastContainer
        autoClose={3000}
        closeOnClick
        draggable
        hideProgressBar
        newestOnTop
        pauseOnFocusLoss
        pauseOnHover
        position="top-right"
        rtl={false}
        transition={Flip}
      />

      {welcomeModalIsOpen ? <WelcomeModal close={toggleWelcomeModal} /> : null}
    </>
  )
}
