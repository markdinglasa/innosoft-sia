import { mdiInformation, mdiPlay } from '@mdi/js'

import { SFC } from '@shared/types'
import * as S from './Styles'
export const Initialize: SFC = ({className}) => {
    const handleInitialize = () => {
        alert('Initializing...')
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