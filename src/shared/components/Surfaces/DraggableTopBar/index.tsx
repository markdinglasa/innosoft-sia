import { SFC } from '@shared/types'
import { CloseAppButton } from '../../Navigation'
import * as S from './Styles'

export const DraggableTopBar: SFC = ({ className }) => {
  return (
    <S.Header className={className}>
      <S.Container>
        <S.Title>Innosoft Sales Insights & Analytics</S.Title>
        <S.ButtonBar>
          <CloseAppButton />
        </S.ButtonBar>
      </S.Container>
    </S.Header>
  )
}
