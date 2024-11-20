
import { SFC } from '@shared/types';
import { ReactNode } from 'react';
import * as S from './Styles';

export interface SideBarProps {
   children: ReactNode;
}

export const SideBar: SFC<SideBarProps> = ({className, children}) => {
    return (
        <>
            <S.Container className={className}>
               {children}
            </S.Container>
        </>
    );
}