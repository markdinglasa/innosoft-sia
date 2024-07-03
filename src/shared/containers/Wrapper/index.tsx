import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { Windows as App } from '../../../renderer/src/registry'
import { useReadIpc, useToggle } from '@shared/hooks';
import { loadSystemData, loadWindowData } from '@shared/internal';
import { WelcomeModal } from '@shared/modals';
import { getSelf, getStoreLoaded } from '@shared/selectors/state';
import { setStoreLoadedTrue } from '@shared/store/internal';
import { setSelf } from '@shared/store/self';
import { IpcChannel, LocalElectronStore, WindowDispatch } from '@shared/types';
import { generateAccount, loadStoreFailToast } from '@shared/utils';
import { FC, ReactNode, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from '../Layout';
import * as S from './Styles';
export const Wrapper: FC = () => {
  const [welcomeModalIsOpen, toggleWelcomeModal] = useToggle(false);
  const dispatch = useDispatch<WindowDispatch>();
  const self = useSelector(getSelf);
  const storeLoaded = useSelector(getStoreLoaded);

  const loadStoreSuccessCallback = useCallback(
    (store: LocalElectronStore) => {
      if (storeLoaded) return;

      const storeSelf = loadSystemData(dispatch, store);
      loadWindowData(dispatch, store);
      dispatch(setStoreLoadedTrue());

      if (!storeSelf.accountNumber) {
        const {publicKeyHex, signingKeyHex} = generateAccount();
        dispatch(setSelf({accountNumber: publicKeyHex, displayImage: '', displayName: '', signingKey: signingKeyHex}));
        toggleWelcomeModal();
      }
    },
    [dispatch, storeLoaded, toggleWelcomeModal],
  );

  const loadStoreData = useReadIpc({
    channel: IpcChannel.loadStore,
    failCallback: loadStoreFailToast,
    successCallback: loadStoreSuccessCallback,
  });

  useEffect(() => {
    loadStoreData();
  }, [loadStoreData]);

  const renderLayout = (): ReactNode => {
    if (!self.accountNumber || !storeLoaded) return null;
    return <Layout />;
  };

  return (
    <>
      <S.Wrapper>
        {renderLayout()}
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
      </S.Wrapper>
      {welcomeModalIsOpen ? <WelcomeModal close={toggleWelcomeModal} /> : null}
    </>
  );
};
