import { memo } from "react";
import LoginForm from "../../../features/authentication/components/login-form";
import * as S from './styles';

function LoginPage() {
  return (
    <S.Container>
      <S.Content>
          <S.Banner>
           <S.Title>NUTSHELL</S.Title>
            <S.SubTitle>Grow your business with NUTSHELL</S.SubTitle>
          </S.Banner>
        <S.Right>
          <LoginForm />
        </S.Right>
      </S.Content>
    </S.Container>
  )
}

export default memo(LoginPage);