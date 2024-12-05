import { MenuTitleProps, SFC } from '@shared/types'
import * as S from './Styles'

export const MenuTitle: SFC<MenuTitleProps> = ({ children, className, isCollapsed }) => {
  if (isCollapsed) return null
  return <S.Container className={className}>{children}</S.Container>
}
