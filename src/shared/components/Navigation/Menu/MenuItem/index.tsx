import { MenuItemProps, SFC } from '@shared/types'
import * as S from './Styles'

export const MenuItem: SFC<MenuItemProps> = ({
  children,
  className,
  icon,
  isActivePage,
  onClick
}) => {
  //const collapse = isCollapsed? false: false
  return (
    <S.Container isActivePage={isActivePage!} className={className} onClick={onClick}>
      <S.Icon $isActivePage={isActivePage!} path={icon} size="20px" />
      <S.Text $isActivePage={isActivePage!} $isCollapsed={false}>
        {children}
      </S.Text>
    </S.Container>
  )
}
