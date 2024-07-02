import { mdiClipboardCheckMultipleOutline, mdiContentCopy } from '@mdi/js';
import { ButtonColor, ButtonType, SFC, WindowDispatch } from '@shared/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as S from './Styles';

export const Key: SFC = ({ className }) => {
    const [key, setKey] = useState('');
    const dispatch = useDispatch<WindowDispatch>();
    useEffect(() => {
        const fetchKey = async () => {
            try {
                /*const response = await axios.get(`${baseUrl}/license/key`, {
                    withCredentials: true,
                });
                if (response.data) {
                    setKey(response.data.key);
                    dispatch(setActiveKey(response.data.key));
                };*/
            } catch (error) {
                setKey('');
            }
        };
        fetchKey();
    }, []);

    const [copyStatus, setCopyStatus] = useState('Copy')
    const copyToClipboard = () => {
        navigator.clipboard.writeText(key)
            .then(() => {
                setCopyStatus('Copied');
                setTimeout(() => setCopyStatus('Copy'), 4000);
            })
            .catch(error => console.error('Error copying to clipboard:', error));
    };
    return (
        <S.Container className={className}>
            <S.ButtonCon>
                <S.Label>Key</S.Label>
                <S.Button
                    onClick={copyToClipboard}
                    iconLeft={copyStatus === 'Copy' ? mdiContentCopy : mdiClipboardCheckMultipleOutline}
                    color={ButtonColor.blue}
                    type={ButtonType.button} 
                    text={copyStatus}
                    />
            </S.ButtonCon>
            <S.Input type="text" value={key} readOnly />
        </S.Container>
    );
};
