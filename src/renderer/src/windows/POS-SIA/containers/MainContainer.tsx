import { AppWindow } from '@shared/components'
import { SFC, WindowDispatch, WindowProps } from '@shared/types'
import { useDispatch } from 'react-redux'
import { setActivePage } from '../store/manager'
import { Page } from '../types'
import * as S from './Styles'

export const SIAManager: SFC<WindowProps> = ({ className, display }) => {
  const dispatch = useDispatch<WindowDispatch>();
  const handle = () => {
    dispatch(setActivePage(Page.test))
  }
  return (
    <>
      <AppWindow className={className} display={display}>
        <S.Container>
          <S.TopBar />
          <S.ContentWrapper>
            <S.Wrapper>
              <S.SideBar />
              <S.Content />
            </S.Wrapper>
          </S.ContentWrapper>
        </S.Container>
      </AppWindow>
    </>
  )
}
/*    */