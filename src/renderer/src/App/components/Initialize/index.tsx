import { getActiveTenant } from '../../selectors'
import { SFC } from '@shared/types'
import { useSelector } from 'react-redux'
import { Tenants } from '../../types'
import { MegaworldReport } from './MegaworldReport'
import { SMReport } from './SMReport'
import { AllianceReport } from './AllianceReport'

export const Initialize: SFC = ({ className }) => {
  const activeTenant = useSelector(getActiveTenant)

  const renderReport = () => {
    switch (activeTenant) {
      case Tenants.SM:
        return <SMReport className={className} />
      case Tenants.MW:
        return <MegaworldReport className={className} />
      case Tenants.ALLIANCE:
        return <AllianceReport className={className} />
      default:
        return null
    }
  }

  return <>{renderReport()}</>
}
