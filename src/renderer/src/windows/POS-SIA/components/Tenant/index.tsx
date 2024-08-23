import { mdiInformation, mdiStore } from '@mdi/js'

import { useToggle } from '@shared/hooks'
import { ButtonColor, SFC, Theme } from '@shared/types'
import { useSelector } from 'react-redux'
import { Card, EditButton, SpacedItems } from '../../components'
import { TenantModal } from '../../modals'
import { getInitialize, getTenant } from '../../selectors'
import * as S from './Styles'

export const Tenant: SFC = ({ className }) => {
  const tenant = useSelector(getTenant)
  const [modalIsOpen, toggleModal] = useToggle(false)
  const tenantCode = tenant?.TenantCode
  const initialized = useSelector(getInitialize)
  const renderContent = () => {
    if (!tenantCode) return <S.Button onClick={toggleModal} iconLeft={mdiStore} color={ButtonColor.blue} text="Select Tenant"/>
    return renderTenant()
  }

  const renderModal = () => {
    if (!modalIsOpen) return null
    return <TenantModal close={toggleModal} theme={Theme.dark} />
  }

  const renderTenant = () => {
    return (
      <SpacedItems
        leftContent={<S.TenantIdentification tenantCode={tenantCode!} salesType={`${tenant?.SMSalesType}`} />}
        rightContent={!initialized && <EditButton onClick={toggleModal} />}
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
        <Card heading="Tenant">{renderContent()}</Card>
      </S.Container>
      {renderModal()}
    </>
  )
}
