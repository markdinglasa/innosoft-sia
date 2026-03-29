import { mdiChevronDown, mdiChevronRight } from '@mdi/js';
import {
  ButtonColor,
  ButtonType,
  GenericFunction,
  SFC,
} from '@shared/types';
import { memo, ReactNode, useState } from 'react';
import * as S from './Styles';

export interface MenuProps {
  icon?: string;
  label: string;
  onClick?: GenericFunction;
  isCollapse: boolean;
  isParent?: boolean;
  children?: ReactNode;
  isChild?: boolean;
  isActive?: boolean;
}

export const Menu: SFC<MenuProps> = memo(
  ({
    className,
    icon,
    label,
    onClick,
    isParent = false,
    isActive = false,
    children,
  }) => {
    const [isDisplay, toggleDisplay] = useState(false);
    return (
      <>
          <S.Container
            $isParent={isParent}
            className={className}
            onClick={(e) => {
              e.stopPropagation();
              if (isParent) {
                // Toggle the parent menu only if it's directly clicked
                toggleDisplay(!isDisplay);
              } else if (!isParent) {
                // Trigger the onClick prop for navigation if it's a child menu
                if (onClick) onClick();
              }
            }}
          >
            {isParent ? (
              <>
                <S.Menu>
                  <S.MenuContent>
                    <S.Icon path={icon ?? ''} size="30px" />
                    <S.Text>
                      <S.Label>{label}</S.Label>
                      {!isDisplay ? (
                        <S.Icon path={mdiChevronRight} size="30px" />
                      ) : (
                        <S.Icon path={mdiChevronDown} size="30px" />
                      )}
                    </S.Text>
                  </S.MenuContent>
                </S.Menu>
                <S.ChildContent
                  $isActive={isActive}
                  $isDisplay={isDisplay}
                  onClick={(e) => e.stopPropagation()}
                >
                  {children}
                </S.ChildContent>
              </>
            ) : (
              <S.ChildMenu $isActive={isActive}>
                <S.Icon path={icon ?? ''} size="30px" />
                <S.ChildLabel>{label}</S.ChildLabel>
              </S.ChildMenu>
            )}
          </S.Container>
        
      </>
    );
  }
);
export default Menu;
