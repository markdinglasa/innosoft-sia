import { SFC } from '@shared/types'
import { ReactNode } from 'react'
import * as S from './Styles'
export interface TopCardProps {
  children: ReactNode
  heading: string
}
export const Card: SFC<TopCardProps> = ({ children, className, heading }) => {
  return (
    <S.Container className={className}>
      <S.Heading>{heading}</S.Heading>
      <S.Content>{children}</S.Content>
    </S.Container>
  )
}
