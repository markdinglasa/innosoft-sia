import { mdiInformation, mdiPlay } from '@mdi/js'

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
    
    const handleInitialize = () => {
        if (!checkFields || !isConnected || !tenant) {
            alert('Error')
        } else {
            alert('Initializing...')
            const SIATransactions = window.electron.sql.get(SqlChannel.getSIA).then(
                (response: any) => {
                    console.log(response.List)
                }
            ).catch(
                (error: any) => {
                    console.log(error)
                }
            )
            //create a CSV
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