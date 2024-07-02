import { GenericVoidFunction, SFC } from '@shared/types';
import * as S from './Styles';

export interface MenuItemProps {
  children: string;
  icon: string;
  isActivePage: boolean;
  isCollapsed: boolean;
  onClick: GenericVoidFunction;
}

export const MenuItem: SFC<MenuItemProps> = ({children, className, icon, isActivePage, isCollapsed, onClick}) => {
  return (
    <S.Container $isActivePage={isActivePage} $isCollapsed={isCollapsed} className={className} onClick={onClick}>
      <S.Icon $isActivePage={isActivePage} path={icon} size="20px" />
      <S.Text $isActivePage={isActivePage} $isCollapsed={isCollapsed}>
        {children}
      </S.Text>
    </S.Container>
  );
};