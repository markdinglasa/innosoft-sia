import { mdiInformation, mdiStore } from '@mdi/js'

import { useToggle } from '@shared/hooks'
import { SFC, Theme } from '@shared/types'
import { useSelector } from 'react-redux'
import { Card, EditButton, SpacedItems } from '../../components'
import { TenantModal } from '../../modals'
import { getInitialize, getTenant } from '../../selectors'
import * as S from './Styles'

export const Tenant: SFC = ({ className }) => {
  const tenant = useSelector(getTenant)
  const [modalIsOpen, toggleModal] = useToggle(false)
  const tenantName = tenant?.tenantName
  const initialized = useSelector(getInitialize)
  console.log('tenantName:', tenantName)
  const renderContent = () => {
    if (!tenantName) return <S.Button onClick={toggleModal} iconLeft={mdiStore} text="Select Tenant"/>
    return renderTenant()
  }

  const renderModal = () => {
    if (!modalIsOpen) return null
    return <TenantModal close={toggleModal} theme={Theme.dark} />
  }

  const renderTenant = () => {
    return (
      <SpacedItems
        leftContent={<S.TenantIdentification tenantCode={tenantName!} salesType={`${tenant?.tenantId}`} />}
        rightContent={!initialized && <EditButton onClick={toggleModal} />}
      />
    )
  }

  return (
    <>
      <S.Container className={className}>
        <S.Text>
          <S.Icon path={mdiInformation} size="30px"/> 
          <S.Span> Please input the Alliance tenant details</S.Span>
        </S.Text>
        <Card heading="Tenant">{renderContent()}</Card>
      </S.Container>
      {renderModal()}
    </>
  )
}
