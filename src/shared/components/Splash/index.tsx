import { SFC } from "@shared/types";
import { ReactNode } from "react";
import * as S from './Styles';

interface SplashProps {
    message?: ReactNode;
}
export const Splash: SFC<SplashProps> = ({className, message}) => {
    return (
        <>
        <S.Container className={className}>
            <S.Logo >
                <S.Image src="../../assets/logo.jpg"/>
            </S.Logo>
            <S.Wrapper>
                <S.SpinnerContainer>
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
                </S.SpinnerContainer>
                <S.Message>{message}</S.Message>
            </S.Wrapper>
        </S.Container>
           
        </>
    )
}