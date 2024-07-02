import { SFC } from "@shared/types"
import { ReactNode } from "react"
import { useSelector } from "react-redux"
import { Dashboard, Reports, SIA } from "../../pages"
import { getActivePage } from "../../selectors"
import { Page } from "../../types"
import * as S from './Styles'

type PageDict = {
    [key in Page]: ReactNode;
};

export const Content: SFC = ({className}) => {
    const activePage = useSelector(getActivePage);
    console.log('ACTIVE -PAGE'+activePage);
    const renderActivePage = () => {
        const pages: PageDict = {
            [Page.login]: <Dashboard />,
            [Page.dashboard]: <Dashboard />,
            [Page.reports]: <Reports />,
            [Page.sia_table]: <SIA />,
            [Page.test]: undefined
        };
    
        return pages[activePage];
      };
    
    return (
        <>
        <S.Container className={className}>
            <S.MainContent>
                {renderActivePage()}
            </S.MainContent>
        </S.Container>
        </>
    )
}