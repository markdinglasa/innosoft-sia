import { SFC } from "@shared/types";
import * as S from './Styles';

export const Splash: SFC = () => {
    return (
        <>
        <S.Logo >
            <S.Image src="../../assets/logo.jpg"/>
        </S.Logo>
        <S.Container>
            <S.DotSpinner>
                <S.DotSpinner__Dot></S.DotSpinner__Dot>
                <S.DotSpinner__Dot></S.DotSpinner__Dot>
                <S.DotSpinner__Dot></S.DotSpinner__Dot>
                <S.DotSpinner__Dot></S.DotSpinner__Dot>
                <S.DotSpinner__Dot></S.DotSpinner__Dot>
                <S.DotSpinner__Dot></S.DotSpinner__Dot>
                <S.DotSpinner__Dot></S.DotSpinner__Dot>
                <S.DotSpinner__Dot></S.DotSpinner__Dot>
            </S.DotSpinner>
        </S.Container>
           
        </>
    )
}