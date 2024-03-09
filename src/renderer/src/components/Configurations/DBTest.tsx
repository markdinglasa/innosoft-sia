import { useEffect, useState } from 'react';

export const DBTest = () => {
const [test, setTest] = useState('');

  useEffect(() => {
    const fetchLicenseKey = async () => {
      try {
        const connection:any = await window.api.get('get-connected');
         // If licenseKey is falsy or null, set key to 'NA'
        setTest(connection.connected);
      } catch (error) {
        console.error('Error fetching license key:', error);
        // Handle error if needed
      }
    };

    fetchLicenseKey();
  }, []);

  return <span className='border-red'>{'test-here: ' + test}</span>;
}


