import { getActiveLicense } from "@shared/selectors";
import { setActiveWindow } from "@shared/store/manager";
import { WindowDispatch, Windows } from "@shared/types";
import { SqlChannel } from "@shared/types/sql";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useWindowInitialize = (): void => {
  const dispatch = useDispatch<WindowDispatch>();
  const isLicense = useSelector(getActiveLicense);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await window.electron.sql.get(SqlChannel.isConnected);
        handleConnectionResult(isConnected);
      } catch {
        dispatch(setActiveWindow(Windows.dbConfig));
      }
    };

    const handleConnectionResult = (isConnected: boolean) => {
      if (isConnected) {
        dispatch(setActiveWindow(isLicense ? Windows.login : Windows.license));
      } else {
        dispatch(setActiveWindow(Windows.dbConfig));
      }
    };

    checkConnection();
  }, [dispatch, isLicense]);
};
