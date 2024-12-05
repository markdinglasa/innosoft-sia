export interface MenuItemProps {
  children: string
  icon: string
  isActivePage?: boolean
  isCollapsed?: boolean
  onClick?: any
}

export interface MenuTitleProps {
  children: string
  isCollapsed: boolean
}
