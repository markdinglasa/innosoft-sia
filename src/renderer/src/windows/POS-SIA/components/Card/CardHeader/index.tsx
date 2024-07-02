
import { SFC } from '@shared/types';
import { ReactNode } from 'react';
import * as S from './Styles';

export interface CardFooterProps {
   children: ReactNode;
}

export const CardFooter: SFC<CardFooterProps> = ({className, children}) => {
    return (
        <>
            <S.Container className={className}>
               {children}
            </S.Container>
        </>
    );
}