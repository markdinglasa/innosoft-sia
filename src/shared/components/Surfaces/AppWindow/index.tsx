import { AppProps, SFC } from '@shared/types'
import { ReactNode } from 'react'
import * as S from './Styles'

interface AppWindowProps extends AppProps {
  children: ReactNode
}

export const AppWindow: SFC<AppWindowProps> = ({ children, className, display }) => {
  return (
    <S.Container className={className} $display={display}>
      {children}
    </S.Container>
  )
}
