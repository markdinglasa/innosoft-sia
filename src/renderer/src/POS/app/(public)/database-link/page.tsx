import { memo } from 'react'
import PublicLayout from '../../../components/layout/public-layout'
import DatabaseLink from '../../../features/database-link/components/database-link'

function DatabaseLinkPage() {
  return (
    <PublicLayout>
      <DatabaseLink />
    </PublicLayout>
  )
}

export default memo(DatabaseLinkPage)