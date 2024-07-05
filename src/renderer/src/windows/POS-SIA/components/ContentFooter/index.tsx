import { SFC } from '@shared/types';
import { ReactNode } from 'react';
import * as S from './Styles';

export interface ContentFooterProps {
  children: ReactNode;
}

export const ContentFooter: SFC<ContentFooterProps> = ({ className, children }) => {
  return (
    <>
      <S.Container className={className}>
        { children }
      </S.Container>
    </>
  )
}
