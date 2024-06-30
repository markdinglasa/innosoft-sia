import { DraggableTopBar } from '@shared/components'
import { SFC } from '../../types'
import * as S from './Styles'

export const Layout: SFC = ({ className }) => {
  return (
    <>
      <S.Container className={className}>
        <DraggableTopBar />
        <S.MainArea />
      </S.Container>
    </>
  )
}
