import { ReactNode } from 'react'

import { SFC } from '@shared/types'
import * as S from './Styles'

export interface TopCardProps {
  children: ReactNode
  heading: string
}

export const TopCard: SFC<TopCardProps> = ({ children, className, heading }) => {
  return (
    <S.Container className={className}>
      <S.Heading>{heading}</S.Heading>
      <S.Content>{children}</S.Content>
    </S.Container>
  )
}
