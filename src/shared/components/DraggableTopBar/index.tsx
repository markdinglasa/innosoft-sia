import { CloseAppButton } from '..'
import * as S from './Styles'

export const DraggableTopBar = () => {
  return (
    <S.Header>
      <S.Container>
        <S.Title>Innosoft SIA</S.Title>
        <S.ButtonBar>
          <CloseAppButton />
        </S.ButtonBar>
      </S.Container>
    </S.Header>
  )
}
