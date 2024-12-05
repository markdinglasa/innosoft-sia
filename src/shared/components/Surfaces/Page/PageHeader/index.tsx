import { SFC } from '@shared/types'
import { ReactNode } from 'react'
import * as S from './Styles'
interface PageHeaderProps {
  title?: string
  buttons?: ReactNode
  icon?: string
}
export const PageHeader: SFC<PageHeaderProps> = ({ className, title, buttons, icon }) => {
  return (
    <>
      <S.Container className={className}>
        <S.Title>
          {icon && <S.Icon path={icon} size="28px" />}
          <S.Span>{title}</S.Span>
        </S.Title>
        <S.Buttons>{buttons}</S.Buttons>
      </S.Container>
    </>
  )
}
