import { SFC } from '@shared/types'
import { Windows } from '../../../../renderer/src/registry'
import * as S from './Styles'

export const MainArea: SFC = ({ className }) => {
  return (
    <S.Container className={className}>
      <Windows />
    </S.Container>
  )
}
