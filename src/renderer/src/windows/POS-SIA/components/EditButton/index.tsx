import { mdiPencil } from '@mdi/js'

import { GenericVoidFunction, SFC } from '@shared/types'
import * as S from './Styles'

export interface EditButtonProps {
  onClick: GenericVoidFunction
}

export const EditButton: SFC<EditButtonProps> = ({ className, onClick }) => {
  return (
    <S.Container className={className} onClick={onClick}>
      <S.Icon path={mdiPencil} size="35px" />
    </S.Container>
  )
}
