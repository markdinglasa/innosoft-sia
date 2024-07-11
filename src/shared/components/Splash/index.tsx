import logo from '@shared/assets/logo.svg';
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
                <S.Wrapper>
                    <S.SpinnerContainer >
                        <S.Logo>
                            <S.Image src={logo}/>
                        </S.Logo>
                        <S.Message>{message}</S.Message>
                        <S.LineWooble></S.LineWooble>
                    </S.SpinnerContainer>
                </S.Wrapper>
            </S.Container>
        </>
    )
}