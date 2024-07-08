import { mdiInformation, mdiPlay } from '@mdi/js'
import { SIA_QUERY } from '@shared/query/SIAQuery'
import { SFC, SqlChannel } from '@shared/types'
import { useSelector } from 'react-redux'
import { getIsConnected, getPath, getTenant } from '../../selectors'
import * as S from './Styles'
export const Initialize: SFC = ({className}) => {
    const path = useSelector(getPath)
    const isConnected = useSelector(getIsConnected)
    const tenant = useSelector(getTenant)
    const checkFields = (): boolean => {
        const checkField = window.electron.sql.get(SqlChannel.checkFields, path).then(
            (response: any)=>{
                if(response.IsSomething) {
                   console.log('SucResponse'+ response.Message)
                } else {
                    console.log('ErrResponse'+ response.Message)
                }
            }
        ).catch(
            (error: any)=>{
                console.log('ErrResponse'+ error)
            }
        )
        if (checkField.IsSomething) return true
        else return false
    }
    
    const handleInitialize = async () => {
        if (!checkFields || !isConnected || !tenant) {
            alert('Error')
        } else {
            alert('Initializing...')
            let TerminalId =tenant.TerminalId, SMPOSSerialNumber = tenant.POSSerialNumber
            const query = SIA_QUERY({TerminalId, SMPOSSerialNumber});
            console.log(query)
            const SIATransactions:Response = await window.electron.sql.get(SqlChannel.getSIA, `${path}/${'SIA'}`, query);
            console.log(SIATransactions)
        }

    }
    return (
        <>
            <S.Container className={className}>
                <S.Text>
                    <S.Icon path={mdiInformation} size="30px"/> 
                    <S.Span> Prior to starting, the things listed above must be set.</S.Span>
                </S.Text>
                <S.Button onClick={handleInitialize} iconLeft={mdiPlay} text="Start"/>
            </S.Container>
        </>
    )
}
