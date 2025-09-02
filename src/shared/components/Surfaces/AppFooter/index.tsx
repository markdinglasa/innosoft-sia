import { APP_VERSION } from '@shared/constants'
import { SFC } from '@shared/types'
import logo from '../../../../../resources/innosoftlogo.svg'
import * as S from './Styles'

export const AppFooter: SFC = ({ className }) => {
  return (
    <>
      <S.Container className={className}>
        <S.LogoContainer>
          <S.Image src={logo} />
        </S.LogoContainer>
        <S.TextContainer>
          <S.Span>iSIA {APP_VERSION}</S.Span>
          <S.Span>{new Date().getFullYear()} &copy; Cebu Innosoft Solution Services Inc.</S.Span>
          <S.Span>Call Support: (032) 263-2912 | 0927 864 5960</S.Span>
        </S.TextContainer>
      </S.Container>
    </>
  )
}
