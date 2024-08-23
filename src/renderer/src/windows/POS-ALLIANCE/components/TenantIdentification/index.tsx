import { mdiStore } from '@mdi/js'
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
  return (
    <Identification
      bottomText={truncate(salesType, 16)}
      className={className}
      displayImage={mdiStore}
      topText={truncate(tenantCode, 16)}
    />
  )
}
