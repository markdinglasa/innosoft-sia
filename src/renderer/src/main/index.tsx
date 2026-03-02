import { SFC } from '@shared/types'
import { Encryptor } from '../encryptor'
import * as S from './Styles'
export const MainArea: SFC = ({ className }) => {

  return (
    <S.Container className={className}>
      <Encryptor/>
    </S.Container>
  )
}
