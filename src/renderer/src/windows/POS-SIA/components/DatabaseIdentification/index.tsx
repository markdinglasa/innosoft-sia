import { mdiDatabase } from '@mdi/js'
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
  return (
    <Identification
      bottomText={truncate(server, 16)}
      className={className}
      displayImage={mdiDatabase}
      topText={truncate(database, 16)}
    />
  )
}
