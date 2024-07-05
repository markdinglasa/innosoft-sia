import { SFC } from '@shared/types'
//import * as S from './Styles'
import { ContentBody, ContentFooter, ContentHeader, PageContainer } from '@shared/components'



export const SIA: SFC = ({ className }) => {
  return (
    <PageContainer className={className}>
      <ContentHeader Title="SIA" />
      <ContentBody className={className}> {'Body'} </ContentBody>
      <ContentFooter> Footer </ContentFooter>
    </PageContainer>
  )
}
