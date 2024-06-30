import { Windows } from '@renderer/registry'
import { SFC } from '@shared/types'
import * as S from './Styles'

export const MainArea: SFC = ({ className }) => {
  return (
    <S.Container className={className}>
      <Windows />
    </S.Container>
  )
}
