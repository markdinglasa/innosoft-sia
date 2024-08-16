import { MainWindow } from '@renderer/windows/MainWindow';
import { DraggableTopBar } from '@shared/components';
import { Snackbar as CSnackbar } from '@shared/components/Snackbar';
import { useReadIpc } from '@shared/hooks';
import { loadSystemData, loadWindowData } from '@shared/internal';
import { getSnackbar, getStoreLoaded } from '@shared/selectors/state';
import { setStoreLoadedTrue } from '@shared/store/internal';
import { setSnackbar } from '@shared/store/manager';
import { IpcChannel, LocalElectronStore, Snackbar as TSnackbar, ToastType, WindowDispatch, } from '@shared/types';
import { loadStoreFailToast } from '@shared/utils';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import * as S from './Styles';

export const Wrapper: FC = () => {
  const dispatch = useDispatch<WindowDispatch>();
  const storeLoaded = useSelector(getStoreLoaded);
  const snackbar = useSelector(getSnackbar)
  
  const loadStoreSuccessCallback = useCallback(
    (store: LocalElectronStore) => {
      if (storeLoaded) return;
      loadSystemData(dispatch, store);
      setTimeout(() => {
        loadWindowData(dispatch, store);
        dispatch(setStoreLoadedTrue());
      }, 0);
    },
    [dispatch, storeLoaded]
  );

  const loadStoreData = useReadIpc({
    channel: IpcChannel.loadStore,
    failCallback: loadStoreFailToast,
    successCallback: loadStoreSuccessCallback,
  });

  useEffect(() => {
    if (!storeLoaded) loadStoreData();
  }, [loadStoreData, storeLoaded]);

  const handleCloseSnackbar = () => {
    const sb: TSnackbar = {
        display: false,
        message: '',
        type: ToastType.error,
    }; dispatch(setSnackbar(sb));
  };

  const renderSnackbar = () => {
    if (snackbar && snackbar.display) return <CSnackbar message={snackbar.message} type={snackbar.type} onClose={handleCloseSnackbar} />;
    return null;
  };

  return (
    <S.Wrapper>
      <DraggableTopBar/>
      <MainWindow />
      {renderSnackbar()}
    </S.Wrapper>
  );
};
