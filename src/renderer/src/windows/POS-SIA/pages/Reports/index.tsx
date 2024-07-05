import { SFC } from '@shared/types'
//import * as S from './Styles'
import { ContentBody, ContentFooter, ContentHeader, PageContainer } from '@shared/components'


export const Reports: SFC = ({ className }) => {
  return (
    <PageContainer className={className}>
      <ContentHeader Title="Reports" />
      <ContentBody className={className}> {'Body'} </ContentBody>
      <ContentFooter> Footer </ContentFooter>
    </PageContainer>
  )
}
