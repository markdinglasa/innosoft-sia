import { mdiInformation, mdiPause, mdiPlay } from '@mdi/js'
import { ButtonColor, SFC, SqlChannel, WindowDispatch } from '@shared/types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getInitialize, getIsConnected, getPath, getTenant } from '../../selectors'
import { setInitialize } from '../../store/manager'
import { LoadingScreen } from '../LoadingScreen'
import * as S from './Styles'

export const Initialize: SFC = ({ className }) => {
    const path = useSelector(getPath)
    const isConnected = useSelector(getIsConnected)
    const tenant = useSelector(getTenant)
    const initialized = useSelector(getInitialize);
    const dispatch = useDispatch<WindowDispatch>()
    const [loading, setLoading] = useState<boolean>(false)

    const checkFields = async (): Promise<boolean> => {
        try {
            const response: any = await window.electron.sql.get(SqlChannel.checkFields, path)
            if (response.IsSomething) {
                console.log('SucResponse: ' + response.Message)
                return true
            } else {
                console.log('ErrResponse: ' + response.Message)
                return false
            }
        } catch (error: any) {
            console.log('ErrResponse: ' + error)
            return false
        }
    }

    const renderLoadingScreen = () => {
        if (loading) {
            return <LoadingScreen />
        } else {
            return null
        }
    }

    const handleInitialize = async () => {
        const fieldsValid = await checkFields()
        if (!fieldsValid || !isConnected || !tenant) {
            alert('Error')
        } else {
            dispatch(setInitialize(true))
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
            }, 9000)
        }
    }
    const handlePause = () => {
        if (initialized) {
            dispatch(setInitialize(false))
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
            }, 9000)
        } else {
            alert('Sonething went wrong')
        }
    }
    return (
        <>
            <S.Container className={className}>
                <S.Text>
                    <S.Icon path={mdiInformation} size="30px" />
                    <S.Span> Prior to starting, the things listed above must be set.</S.Span>
                </S.Text>
                {initialized && <S.Button onClick={handlePause} iconLeft={mdiPause} text="Pause" color={ButtonColor.green}/>}
                {!initialized && <S.Button onClick={handleInitialize} iconLeft={mdiPlay} text="Start" color={ButtonColor.blue}/>}
                
            </S.Container>
            {renderLoadingScreen()}
        </>
    )
}


//import { SIA_QUERY } from '@shared/query/SIAQuery'
    //c
    /*    let TerminalId =tenant.TerminalId, SMPOSSerialNumber = tenant.POSSerialNumber
            const query = SIA_QUERY({TerminalId, SMPOSSerialNumber});
            console.log(query)
            const SIATransactions:Response = await window.electron.sql.get(SqlChannel.getSIA, `${path}/${'SIA'}`, query);
            console.log(SIATransactions)
             */