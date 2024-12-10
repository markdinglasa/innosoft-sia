import { mdiInformation, mdiStore } from '@mdi/js'
import { SelectOption } from '@shared/components'
import { useToggle } from '@shared/hooks'
import { AppDispatch, SFC, Theme } from '@shared/types'
import { useDispatch, useSelector } from 'react-redux'
import { Tenants } from '../..//types'
import { Card, EditButton, SpacedItems } from '../../components'
import { TenantModal } from '../../modals'
import { getActiveTenant, getInitialize, getTenant } from '../../selectors'
import { setActiveTenant } from '../../store/manager'
import * as S from './Styles'

export const Tenant: SFC = ({ className }) => {
  const tenant = useSelector(getTenant)
  const activeTenant = useSelector(getActiveTenant)
  const initialized = useSelector(getInitialize)
  const [modalIsOpen, toggleModal] = useToggle(false)
  const dispatch = useDispatch<AppDispatch>()
  const tenantCode = tenant?.TenantCode ?? 'NA'

  const renderContent = () => {
    if (!tenantCode)
      return <S.Button onClick={toggleModal} iconLeft={mdiStore} text="Select Tenant" />
    return renderTenant()
  }

  const renderModal = () => {
    if (!modalIsOpen) return null
    return <TenantModal close={toggleModal} theme={Theme.dark} />
  }

  const renderTenant = () => {
    return (
      <SpacedItems
        leftContent={
          <S.TenantIdentification tenantCode={tenantCode!} salesType={`${tenant?.SMSalesType}`} />
        }
        rightContent={!initialized && <EditButton onClick={toggleModal} />}
      />
    )
  }
  const TenantOption = [
    { label: 'Select Tenant', value: Tenants.DEFAULT },
    { label: Tenants.SM, value: Tenants.SM },
    { label: Tenants.RLC, value: Tenants.RLC },
    { label: Tenants.AYALA, value: Tenants.AYALA },
    { label: Tenants.MW, value: Tenants.MW },
    { label: Tenants.ALLIANCE, value: Tenants.ALLIANCE }
  ]
  return (
    <>
      <S.Container className={className}>
        <S.Text>
          <S.Icon path={mdiInformation} size="30px" />
          <S.Span> Please input the tenant details</S.Span>
        </S.Text>
        <S.Div className="w-full">
          <SelectOption
            value={String(activeTenant ?? '')}
            label="Select Tenant"
            name="Tenant"
            options={TenantOption}
            onChange={(e) => dispatch(setActiveTenant(e.target.value))}
            disabled={initialized}
          />
        </S.Div>
        {activeTenant && <Card heading={`${activeTenant} Tenant`}>{renderContent()}</Card>}
      </S.Container>
      {renderModal()}
    </>
  )
}
