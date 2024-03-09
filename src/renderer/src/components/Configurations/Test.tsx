import { useEffect, useState } from 'react';

export const Test = () => {
  const [test, setTest] = useState('');

  useEffect(() => {
    const fetchLicenseKey = async () => {
      try {
        const licenseKey = await window.api.get('get-licenseKey');
        const key = licenseKey || 'NA'; // If licenseKey is falsy or null, set key to 'NA'
        setTest(key);
      } catch (error) {
        console.error('Error fetching license key:', error);
        // Handle error if needed
      }
    };

    fetchLicenseKey();
  }, []);

  return <span className='border-red'>{'test-here: ' + test}</span>;
};


