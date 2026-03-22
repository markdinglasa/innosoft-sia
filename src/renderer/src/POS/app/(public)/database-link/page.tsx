import { Splash } from "@shared/components"
import { lazy, memo, Suspense } from 'react'
import PublicLayout from '../../../components/layout/public-layout'

const DatabaseLink = lazy(() => import('../../../features/database-link/components/database-link'))

function DatabaseLinkPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<Splash />}>
        <DatabaseLink />
      </Suspense>
    </PublicLayout>
  )
}

export default memo(DatabaseLinkPage)