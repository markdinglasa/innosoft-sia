import { SFC } from '@shared/types';
import * as S from './Styles';

export interface MenuTitleProps {
  children: string;
  isCollapsed: boolean;
}

export const MenuTitle: SFC<MenuTitleProps> = ({children, className, isCollapsed}) => {
  if (isCollapsed) return null;

  return <S.Container className={className}>{children}</S.Container>;
};

