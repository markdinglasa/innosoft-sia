import { SFC } from '@shared/types';
import * as S from './Styles';

export const Logo:SFC =({className}) => {

    return (
        <>
            <S.Container className={className}>
                <S.H1>INNO<S.Span>SOFT</S.Span></S.H1>
            </S.Container>
        </>
    )
}