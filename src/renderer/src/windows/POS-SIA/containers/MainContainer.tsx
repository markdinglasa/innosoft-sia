import { AppWindow } from '@shared/components'
import { SFC, WindowProps } from '@shared/types'
import * as S from './Styles'

export const SIAManager: SFC<WindowProps> = ({ className, display }) => {
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