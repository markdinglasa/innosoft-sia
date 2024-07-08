import { mdiInformation, mdiStore } from '@mdi/js'

import { useToggle } from '@shared/hooks'
import { SFC } from '@shared/types'
import { useSelector } from 'react-redux'
import { EditButton, SpacedItems, TopCard } from '../../components'
import { TenantModal } from '../../modals'
import { getTenant } from '../../selectors'
import * as S from './Styles'

export const SysCurrent: SFC = ({ className }) => {
  const tenant = useSelector(getTenant)
  const [modalIsOpen, toggleModal] = useToggle(false)
  const tenantCode = tenant?.TenantCode

  const renderContent = () => {
    if (!tenantCode) return <S.Button onClick={toggleModal} iconLeft={mdiStore} text="Select Tenant"/>
    return renderTenant()
  }

  const renderModal = () => {
    if (!modalIsOpen) return null
    return <TenantModal close={toggleModal} />
  }

  const renderTenant = () => {
    return (
      <SpacedItems
        leftContent={<S.TenantIdentification tenantCode={tenantCode!} salesType={`${tenant?.SMSalesType}`} />}
        rightContent={<EditButton onClick={toggleModal} />}
      />
    )
  }

  return (
    <>
      <S.Container className={className}>
        <S.Text>
          <S.Icon path={mdiInformation} size="30px"/> 
          <S.Span> Please input the SM tenant details</S.Span>
        </S.Text>
        <TopCard heading="Tenant">{renderContent()}</TopCard>
      </S.Container>
      {renderModal()}
    </>
  )
}
