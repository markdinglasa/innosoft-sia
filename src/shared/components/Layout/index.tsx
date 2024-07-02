import { SFC } from '@shared/types';
import { ReactNode } from 'react';
import { SideBar, TopBar } from '..';
import * as S from './Styles';

export interface LayoutProps {
    sideBarContent: ReactNode;
    topBarContent: ReactNode;
}

export const Layout: SFC<LayoutProps> = ({className, sideBarContent, topBarContent}) => {

    return (
        <>
            <S.Container className={className} >
                <TopBar children={topBarContent}/>
                <SideBar children={sideBarContent}/>
            </S.Container>
        </>
    )
}