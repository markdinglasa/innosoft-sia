import { SFC } from '@shared/types'
import { ContentBody, ContentFooter } from '../../components'
import { ContentHeader } from '../../components/ContentHeader'
import * as S from './Styles'

export const Dashboard: SFC = ({ className }) => {
  return (
    <S.Container className={className}>
      <ContentHeader Title="Dashboard" />
      <ContentBody className={className}> {'Body'} </ContentBody>
      <ContentFooter> Footer </ContentFooter>
    </S.Container>
  )
}
