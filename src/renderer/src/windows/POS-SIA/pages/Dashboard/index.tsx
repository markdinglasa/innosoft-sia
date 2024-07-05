import { ContentBody, ContentFooter, ContentHeader, PageContainer } from '@shared/components'
import { SFC } from '@shared/types'


export const Dashboard: SFC = ({ className }) => {
  return (
    <PageContainer className={className}>
      <ContentHeader Title="Dashboard" />
      <ContentBody className={className}> {'Body'} </ContentBody>
      <ContentFooter> Footer </ContentFooter>
    </PageContainer>
  )
}
