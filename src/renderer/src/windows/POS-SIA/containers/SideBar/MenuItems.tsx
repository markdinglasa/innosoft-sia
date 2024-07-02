
import { SFC, WindowDispatch } from '@shared/types'
import { useDispatch, useSelector } from 'react-redux/'
import { MenuItem } from '../../components'
import { getActivePage } from '../../selectors'
import { setActivePage } from '../../store/manager'
import { Page } from '../../types'

export interface MenuItemsProps {
    children: string;
    icon: string;
    isCollapse: boolean;
    page: Page;
}

export const MenuItems: SFC<MenuItemsProps> = ({children, className, icon, isCollapse, page}) => {
    const activePage = useSelector(getActivePage)
    const dispatch = useDispatch<WindowDispatch>();
    
    /*const isActivePage = useMemo(() => {
        if (activePage === Page.dashboard) return true;
        if (activePage === Page.reports) return true;
        if (activePage === Page.sia_table) return true;
        return false;
    }, [activePage, page]);*/
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