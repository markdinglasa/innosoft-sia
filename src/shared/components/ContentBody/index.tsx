import { SFC } from '@shared/types'
import { ReactNode } from 'react'
import * as S from './Styles'

export interface ContentBodyProps {
  children: ReactNode
}

export const ContentBody: SFC<ContentBodyProps> = ({ className, children }) => {
  return (
    <>
      <S.Container className={className}>{children}</S.Container>
    </>
  )
}
