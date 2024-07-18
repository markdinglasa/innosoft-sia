import { Splash } from '@shared/components';
import { Error } from '@shared/messages';
import { getActiveLicense } from '@shared/selectors';
import { setSnackbar } from '@shared/store/manager';
import { Response, SFC, Snackbar, SqlChannel, ToastType, WindowDispatch } from '@shared/types';
import { License } from '@shared/window';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Windows as App } from '../../../../renderer/src/registry';
import * as S from './Styles';

export const MainArea: SFC = ({ className }) => {
  const dispatch = useDispatch<WindowDispatch>();
  const license = useSelector(getActiveLicense);
  const [isLicenseValid, setIsLicenseValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLicense = async () => {
      try {
        const response: Response = await window.electron.sql.post(SqlChannel.isLicense, license);
        const flag = response.IsSomething ? true : false;
        console.log(flag);
        setIsLicenseValid(flag);
        if (!response.IsSomething) {
          const snackbar: Snackbar = {
            display: true,
            message: response.Message,
            type: ToastType.error,
          };

          dispatch(setSnackbar(snackbar));
        }
      } catch (error: any) {
        setIsLicenseValid(false);
        const snackbar: Snackbar = {
          display: true,
          message: Error.e00x02,
          type: ToastType.error,
        };
        dispatch(setSnackbar(snackbar));
      }
    };
    checkLicense();
  }, [license, dispatch]);

  const renderContent = () => {
    if (isLicenseValid !== true) {
      return <Splash message="Please wait..." />;
    }
    return isLicenseValid ? <App /> : <License />;
  };

  return (
    <S.Container className={className}>
      {renderContent()}
    </S.Container>
  );
};
