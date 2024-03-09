import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/index.css';

const Root = () => {
  const [isLicensed, setIsLicensed] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const LICENSE_KEY:any = await window.api.get('get-licenseKey')
      if (!LICENSE_KEY) setIsLicensed(false)
      const validate_lk:any =  await window.api.post('authenticate-licenseKey', LICENSE_KEY)
      setIsLicensed(validate_lk.isLicensed);

      const connection:any = await window.api.get('get-connected');
      setIsConnected(connection.connected);
    };

    checkStatus();
  }, []);

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Root />);
