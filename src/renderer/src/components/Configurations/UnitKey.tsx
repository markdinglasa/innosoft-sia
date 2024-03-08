import { useEffect, useState } from 'react';
import { FaClipboard, FaClipboardCheck } from "react-icons/fa6";

export const UnitKey = () => {
    const [unitKey, setUnitKey] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const uk = await window.api.get('get-unitKey');
                if (!uk) {
                    setUnitKey('NA');
                } else {
                    setUnitKey(String(uk));
                }
            } catch (error) {
                console.error('Error fetching unit key:', error);
            }
        };

        fetchData();
    }, []);// empty dependency array to ensure useEffect runs only once

    const [copyStatus, setCopyStatus] = useState('Copy')
    const copyToClipboard = () => {
        navigator.clipboard.writeText(unitKey)
            .then(() => {
                setCopyStatus('Copied');
                setTimeout(() => setCopyStatus('Copy'), 4000); // Set copy status back to 'Copy' after 4 seconds
            })
            .catch(error => console.error('Error copying to clipboard:', error));
    };
    return (
        <>
            <div className='mb-1 bg-zinc-200 boreder-red rounded-md items-center flex  '>
                <div className='flex justify-start items-center w-full'>
                    <span className='overflow-hidden px-3 py-2'>{ unitKey }</span> 
                </div>
                <div className='flex justify-end items-center'>
                    {unitKey && (
                    <button onClick={copyToClipboard} className=' btn btn-primary rounded-md justify-center items-center flex' style={{width:'40px'}}>
                        <span className='flex items-center justify-center'>{copyStatus === 'Copy' ? <FaClipboard /> : <FaClipboardCheck />}</span>
                    </button>
                    )}   
                </div>

            </div>
        </>
    );
};
