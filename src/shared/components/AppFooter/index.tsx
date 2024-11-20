import { SFC } from '@shared/types'
import logo from '../../../../resources/logo.svg'
import * as S from './Styles'

export const AppFooter: SFC = ({ className }) => {
  return (
    <>
      <S.Container className={className}>
        <S.LogoContainer>
          <S.Image src={logo}  />
        </S.LogoContainer>
        <S.TextContainer>
          <S.Span>Innosoft SIA v1.0</S.Span>
          <S.Span>2024 &copy; Cebu Innosoft Solution Services Inc.</S.Span>
          <S.Span>Call Support: (032) 263-2912 | 0927 864 5960</S.Span>
        </S.TextContainer>
      </S.Container>
    </>
  )
}
