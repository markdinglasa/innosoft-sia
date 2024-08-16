import { Splash } from '@shared/components';
import { getActiveLicense } from '@shared/selectors';
import { setActiveDatabaseConfig, setActiveLicense, setActiveWindow } from '@shared/store/manager';
import { Response, SFC, SqlChannel, WindowDispatch } from '@shared/types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DBConfigWindow, LicenseWindow, SelectorWindow } from '.';

export const MainWindow: SFC = ({ className }) => {
  const license = useSelector(getActiveLicense);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [isLicenseValid, setIsLicenseValid] = useState<boolean | null>(null);
  const dispatch = useDispatch<WindowDispatch>()
  const checkConnectionAndLicense = useCallback(async () => {
    try {
      const [isConnected, response]: [boolean, Response] = await Promise.all([
        window.electron.sql.get(SqlChannel.isConnected),
        license ? window.electron.sql.post(SqlChannel.isLicense, license) : Promise.resolve({ IsSomething: false }),
      ]);

      setIsConfigured(isConnected);
      setIsLicenseValid(response.IsSomething!);
    } catch (error) {
      setIsConfigured(false);
      setIsLicenseValid(false);
      console.error('Error checking SQL connection and license:', error);
    }
  }, [license]);

  useEffect(() => {
    checkConnectionAndLicense();
  }, [checkConnectionAndLicense]);

  const renderContent = () => {
    if (isConfigured === null || isLicenseValid === null ) return <Splash message="Please wait..." />
    if (isConfigured && isLicenseValid) return <SelectorWindow />
    if (isConfigured && !isLicenseValid) return <LicenseWindow />
    return <DBConfigWindow />
  };
  const reset = () => {
    dispatch(setActiveWindow(null))
    dispatch(setActiveLicense(null))
    dispatch(setActiveDatabaseConfig(null))
  }
  return <div className={className}><DBConfigWindow /></div>;
};