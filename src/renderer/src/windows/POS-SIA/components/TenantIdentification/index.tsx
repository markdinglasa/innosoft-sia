import { mdiStore } from '@mdi/js'
import { useAccountDisplayName } from '@shared/hooks'
import { SFC } from '@shared/types'
import { truncate } from '@shared/utils/strings'
import { Identification } from '..'
export interface TenantIdentificationProps {
  tenantCode: string
  salesType: string
}

export const TenantIdentification: SFC<TenantIdentificationProps> = ({
  tenantCode,
  salesType,
  className
}) => {
  const displayName = useAccountDisplayName(tenantCode, 16)

  return (
    <Identification
      bottomText={truncate(salesType, 16)}
      className={className}
      displayImage={mdiStore}
      topText={displayName}
    />
  )
}
