import { SFC } from '../../types'
import * as S from './Styles'

export const Layout: SFC = ({ className }) => {
  return (
    <>
      <S.Container className={className}>
        <S.MainArea />
      </S.Container>
    </>
  )
}
