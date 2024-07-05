import { ContentBody, ContentFooter, ContentHeader, PageContainer } from '@shared/components'
import { SFC } from '@shared/types'
import EnhancedTable from '../../components/Table'
import * as S from './Styles'

export const SIA: SFC = ({ className }) => {
  return (
    <PageContainer className={className}>
      <S.Container className=''>

      </S.Container>
      <ContentHeader Title="SIA" />
      <ContentBody className={className}> 
         <EnhancedTable />
         </ContentBody>
      <ContentFooter> Footer </ContentFooter>
    </PageContainer>
  )
}
