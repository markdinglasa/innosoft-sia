import { Loader2 as Loader } from '@shared/components'
import { SFC } from '@shared/types'
import * as S from './Styles'
export const LoadingScreen: SFC = () => {
    return (
        <>
            <S.Container> 
                <Loader />
            </S.Container>
        </>
    )
}   