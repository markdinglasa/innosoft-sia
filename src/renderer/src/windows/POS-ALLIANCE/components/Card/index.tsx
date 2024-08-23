import { SFC } from '@shared/types'
import { ReactNode } from 'react'
import * as S from './Styles'

interface CardProps {
  children: ReactNode
  heading: string
}
export const Card: SFC<CardProps> = ({ children, className, heading }) => {
  return (
    <S.Container className={className}>
      <S.Heading>{heading}</S.Heading>
      <S.Content>{children}</S.Content>
    </S.Container>
  )
}
