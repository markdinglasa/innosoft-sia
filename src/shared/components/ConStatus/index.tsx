import { ReactNode } from 'react'
import { ConnectionStatus, SFC } from '../../types'
import * as S from './Styles'

export interface ConStatusProps {
  children: ReactNode
  type: ConnectionStatus
}

export const ConStatus: SFC<ConStatusProps> = ({ children, className, type = ConnectionStatus.disconnected }) => {
  return (
    <S.Container className={className} type={type}>
      <S.Text>{children}</S.Text>
    </S.Container>
  )
}
