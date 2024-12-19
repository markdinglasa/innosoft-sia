import { mdiStore } from '@mdi/js'
import { SelectOption } from '@shared/components'
import { AllianceCategory } from '@shared/data/alliance'
import { useToggle } from '@shared/hooks'
import { AppDispatch, SFC, Theme } from '@shared/types'
import { useDispatch, useSelector } from 'react-redux'
import { Card, EditButton, SpacedItems } from '../../components'
import { TenantModal } from '../../modals'
import { getActiveTenant, getAllianceCategory, getInitialize, getTenant } from '../../selectors'
import { setActiveTenant, setAllianceCategory } from '../../store/manager'
import { TenantOption, Tenants } from '../../types'
import * as S from './Styles'

export const Tenant: SFC = ({ className }) => {
  const tenant = useSelector(getTenant)
  const activeTenant = useSelector(getActiveTenant)
  const allianceCategory = useSelector(getAllianceCategory)
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

  return (
    <>
      <S.Container className={className}>
        {/*<S.Text>
          <S.Icon path={mdiInformation} size="30px" />
          <S.Span> Please input the tenant details</S.Span>
        </S.Text>*/}
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
        {activeTenant === Tenants.ALLIANCE && (
          <S.Div className="w-full">
            <SelectOption
              value={String(allianceCategory ?? '')}
              label="Select Category"
              name="Category"
              options={AllianceCategory}
              onChange={(e) => dispatch(setAllianceCategory(e.target.value))}
              disabled={initialized}
            />
          </S.Div>
        )}
        {activeTenant && <Card heading={`${activeTenant} Tenant`}>{renderContent()}</Card>}
      </S.Container>
      {renderModal()}
    </>
  )
}
