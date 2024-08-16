import { CloseAppButton } from '..'
import { SFC } from '../../types'
import * as S from './Styles'

export const DraggableTopBar: SFC = ({ className }) => {
  return (
    <S.Header className={className}>
      <S.Container>
        <S.Title>Innosoft</S.Title>
        <S.ButtonBar>
          <CloseAppButton />
        </S.ButtonBar>
      </S.Container>
    </S.Header>
  )
}
