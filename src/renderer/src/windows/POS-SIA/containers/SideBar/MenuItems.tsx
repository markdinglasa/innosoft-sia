
import { SFC, WindowDispatch } from '@shared/types'
import { useDispatch } from 'react-redux/'
import { MenuItem } from '../../components'
import { setActivePage } from '../../store/manager'
import { Page } from '../../types'

export interface MenuItemsProps {
    children: string;
    icon: string;
    isCollapse: boolean;
    page: Page;
}

export const MenuItems: SFC<MenuItemsProps> = ({children, className, icon, isCollapse, page}) => {
    const dispatch = useDispatch<WindowDispatch>();
    const isActivePage = (): boolean => {
        if (page === Page.dashboard) return true;
        if (page === Page.reports) return true;
        if (page === Page.sia_table) return true;
        return false;
    }
    const handleClick = () => {
       dispatch(setActivePage(page))
    }

    return(
        <>
            <MenuItem
                className={className}
                icon={icon}
                isActivePage={isActivePage()}
                isCollapsed={isCollapse}
                onClick={handleClick}
                >
                {children}
            </MenuItem>
        </>
    )
}