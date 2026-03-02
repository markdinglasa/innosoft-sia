import { APP_VERSION } from '@shared/constants'
import { SFC } from '@shared/types'
import * as S from './Styles'

export const AppFooter: SFC = ({ className }) => {
  return (
    <>
      <S.Container className={className}>
        <S.LogoContainer></S.LogoContainer>
        <S.TextContainer>
          <S.Span> {APP_VERSION}</S.Span>
        </S.TextContainer>
      </S.Container>
    </>
  )
}
