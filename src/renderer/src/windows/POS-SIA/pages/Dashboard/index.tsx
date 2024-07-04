import { SFC } from '@shared/types'
import { ContentHeader } from '../../components/ContentHeader'
import * as S from './Styles'

export const Dashboard: SFC = ({ className }) => {
  return (
    <S.Container className={className}>
      <ContentHeader Title="Dashboard" />
    </S.Container>
  )
}
