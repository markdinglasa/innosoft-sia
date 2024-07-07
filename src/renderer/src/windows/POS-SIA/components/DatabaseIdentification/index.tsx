import { mdiDatabase } from '@mdi/js'
import { useAccountDisplayName } from '@shared/hooks'
import { SFC } from '@shared/types'
import { truncate } from '@shared/utils/strings'
import { Identification } from '..'
export interface DatabaseIdentificationProps {
  database: string
  server: string
}

export const DatabaseIdentification: SFC<DatabaseIdentificationProps> = ({
  database,
  server,
  className
}) => {
  const displayName = useAccountDisplayName(database, 16)

  return (
    <Identification
      bottomText={truncate(server, 16)}
      className={className}
      displayImage={mdiDatabase}
      topText={displayName}
    />
  )
}
