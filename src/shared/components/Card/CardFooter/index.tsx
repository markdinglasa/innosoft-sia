import { SFC } from '@shared/types'
import * as S from './Styles'

export const CardFooter: SFC = ({className}) => {
    return (
        <>
            <S.Container className={className}>
                <S.LoginConFooter>
                    <S.Span> 2024 &copy; Cebu Innosoft Solution Services Inc.</S.Span>
                    <S.Span> Innosoft POS Accreditator v1.1</S.Span>
                </S.LoginConFooter>
            </S.Container>
        </>
    )
}