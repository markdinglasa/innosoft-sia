import { ReactNode } from 'react'
import { SFC, WindowProps } from '../../types'
import * as S from './Styles'

interface AppWindowProps extends WindowProps {
  children: ReactNode
}

export const AppWindow: SFC<AppWindowProps> = ({ children, className, display }) => {
  return (
    <S.Container className={className} $display={display}>
      {children}
    </S.Container>
  )
}
