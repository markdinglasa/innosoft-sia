import { lazy, memo } from 'react'
import PublicLayout from '../../../components/layout/public-layout'

const DatabaseLink = lazy(() => import('../../../features/database-link/components/database-link'))

function DatabaseLinkPage() {
  return (
    <PublicLayout className="border-red">
      <DatabaseLink />
    </PublicLayout>
  )
}

export default memo(DatabaseLinkPage)