
import { SFC } from '@shared/types';
import { ReactNode } from 'react';
import * as S from './Styles';

export interface TopBarProps {
   children: ReactNode;
}

export const TopBar: SFC<TopBarProps> = ({className, children}) => {
    return (
        <>
            <S.Container className={className}>
               {children}
            </S.Container>
        </>
    );
}