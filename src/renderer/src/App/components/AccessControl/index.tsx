import { SFC } from '@shared/types'
import { ReactNode } from 'react'

interface AccessControl {
  condition: boolean
  children: ReactNode
}

export const AccessControl: SFC<AccessControl> = ({ condition, children }) => {
  return <>{condition ? children : null}</>
}
