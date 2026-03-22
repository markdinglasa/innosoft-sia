import DatabaseLinkForm from "@renderer/POS/features/database-link/components/database-link-form"
import { memo } from 'react'
import PublicLayout from '../../../components/layout/public-layout'

function DatabaseLinkPage() {
  return (
    <PublicLayout>
      <DatabaseLinkForm />
    </PublicLayout>
  )
}

export default memo(DatabaseLinkPage)