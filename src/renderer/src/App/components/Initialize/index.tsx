import { SFC } from '@shared/types'
import { useSelector } from 'react-redux'
import { getActiveTenant } from '../../selectors'
import { Tenants } from '../../types'
import { EJournal } from '../EJournal'
import { AllianceReport } from './AllianceReport'
import { MegaworldReport } from './MegaworldReport'
import { SMReport } from './SMReport'

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
      case Tenants.E_JOURNAL:
        return <EJournal className={className} />
      default:
        return null
    }
  }

  return <>{renderReport()}</>
}
