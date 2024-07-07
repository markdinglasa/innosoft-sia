import { SFC } from '@shared/types'
import * as S from './Styles'

export const Top: SFC = ({ className }) => {
  return (
    <>
      <S.Container className={className}>
        <S.Button> Configuration </S.Button>
      </S.Container>
    </>
  )
}
