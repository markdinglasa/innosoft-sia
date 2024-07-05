import { SFC } from '@shared/types';
import { ReactNode } from 'react';
import * as S from './Styles';

export interface PageContainerProps{
  children: ReactNode;
}

export const PageContainer: SFC<PageContainerProps> = ({ className, children}) => {
  return (
      <S.Container className={className}>
        {children}
      </S.Container>
  )
}
