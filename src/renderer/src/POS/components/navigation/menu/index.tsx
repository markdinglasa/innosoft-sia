import { mdiChevronDown, mdiChevronRight } from '@mdi/js';
import {
  AppDispatch,
  GenericFunction,
  SFC
} from '@shared/types';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getActivePage } from "../../../selectors/pos-pages";
import { setActivePage } from "../../../store/manager";
import * as S from './Styles';

export interface MenuProps {
  icon?: string;
  label: string;
  onClick?: GenericFunction;
  isParent?: boolean;
  children?: {
    label:string
    page:string
  }[];
  page?:string
  isChild?: boolean;
  isActive?: boolean;
  category: string
}

export const Menu: SFC<MenuProps> = memo(
  ({
    className,
    icon,
    label,
    isParent = false,
    children,
    page
  }) => {
    const activePage = useSelector(getActivePage)
    const [isDisplay, toggleDisplay] = useState(false);
    const dispatch = useDispatch<AppDispatch>()

    const isCurrentActive = page === activePage;
    const hasActiveChild = children?.some(child => child.page === activePage);

    // Auto-expand if a child is active
    useEffect(() => {
      if (hasActiveChild) {
        toggleDisplay(true);
      }
    }, [hasActiveChild]);

    return (
      <>
          <S.Container
            $isParent={isParent}
            className={className}
            onClick={(e) => e.stopPropagation()}
          >
            {isParent ? (
              <>
                <S.Menu onClick={(e) => {
                  e.stopPropagation();
                  toggleDisplay(!isDisplay);
                }}>
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
                  $isDisplay={isDisplay}
                  onClick={(e) => e.stopPropagation()}
                >
                   {
                  children && children.map((child,index)=>{
                    return(
                      <S.ChildMenu key={index} $isActive={child.page === activePage} onClick={(e) => {
                            e.stopPropagation();
                            // Trigger the onClick prop for navigation if it's a child menu
                            if (child.page) dispatch(setActivePage(child.page));
                        }}>
                        <S.ChildLabel className="ml-[2rem]">{child.label}</S.ChildLabel>
                      </S.ChildMenu>
                    )
                  })
                }
                </S.ChildContent> 
              </>
            ) : (
              <S.ChildMenu $isActive={isCurrentActive} 
                onClick={(e) => {
                  e.stopPropagation();
                  // Trigger the onClick prop for navigation if it's a child menu
                  if (page) dispatch(setActivePage(page));
                }}>
                <S.Icon path={icon ?? ''} size="30px" />
                <S.Text>
                  <S.Label>{label}</S.Label>
                </S.Text>
              </S.ChildMenu>
            )}
          </S.Container>
        
      </>
    );
  }
);
export default Menu;
