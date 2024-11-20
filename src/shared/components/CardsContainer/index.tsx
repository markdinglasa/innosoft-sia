import { ReactNode } from 'react'

import { SFC } from '../../types'
import * as S from './Styles'

export interface CardsContainerProps {
  children: ReactNode
}

export const CardsContainer: SFC<CardsContainerProps> = ({ children, className }) => {
  return <S.Container className={className}>{children}</S.Container>
}
