import { SFC } from '@shared/types'
import * as S from './Styles'
export const PageFooter: SFC = ({className}) => {
    return(
        <>
            <S.Container className={className}>
                <S.Span>2024 &copy; Cebu Innosoft Soulution Services Inc.</S.Span>
                <S.Span>iTMS v1.0 - Mark Dinglasa</S.Span>
            </S.Container>
        </>
    )
}