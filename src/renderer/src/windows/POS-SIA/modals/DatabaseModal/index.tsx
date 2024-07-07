import { SFC } from '@shared/types'
import { DBConfig } from '../../components'
import * as S from './Styles'

interface DatabaseModalProps {
  close(): void
}

export const DatabaseModal: SFC<DatabaseModalProps> = ({ className, close }) => {
  return (
    <S.UModal className={className} close={close} header="Select Database">
      <DBConfig />
    </S.UModal>
  )
}
