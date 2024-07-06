import { ContentBody, ContentFooter, ContentHeader, PageContainer } from '@shared/components'
import { ReadTable } from '@shared/components/Table'
import { SFC } from '@shared/types'
import * as S from './Styles'

export const SIA: SFC = ({ className }) => {
  return (
    <PageContainer className={className}>
      <S.Container className=''>

      </S.Container>
      <ContentHeader Title="SIA" />
      <ContentBody className={className}> 
         <ReadTable />
         </ContentBody>
      <ContentFooter> Footer </ContentFooter>
    </PageContainer>
  )
}
