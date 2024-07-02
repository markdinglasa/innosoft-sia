import { mdiFileDocumentMultiple, mdiHome, mdiTable } from '@mdi/js'
import { SFC } from '@shared/types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux/'
import { MenuTitle } from '../../components'
import { getActivePage } from '../../selectors'
import { Page } from '../../types'
import { MenuItems } from './MenuItems'
import * as S from './Styles'

export const Menu : SFC = ({className}) => {
    const activePage = useSelector(getActivePage);

    const isCollapsed = useMemo( () => {
        const collapsedPage = [
            Page.dashboard,
            Page.reports,
            Page.sia_table,
        ]
        return collapsedPage.includes(activePage);
    }, [activePage])

    const renderDashboard = () => (
        <>
          <MenuItems icon={mdiHome} isCollapse={false} page={Page.dashboard}>
            Dashboard
          </MenuItems>
        </>
      );

    const renderReports = () => (
        <>
          <MenuItems icon={mdiFileDocumentMultiple } isCollapse={false} page={Page.reports}>
            Reports
          </MenuItems>
        </>
      );
    const renderSIATable = () => (
        <>
          <MenuTitle isCollapsed={isCollapsed}>TEACH</MenuTitle>
          <MenuItems icon={mdiTable} isCollapse={false} page={Page.sia_table}>
            Table
          </MenuItems>
        </>
      );
    return (
        <>
          <S.Container className={className}>
              {renderDashboard()}
              {renderSIATable()}
              {renderReports()}
          </S.Container>
        </>
    )
}
