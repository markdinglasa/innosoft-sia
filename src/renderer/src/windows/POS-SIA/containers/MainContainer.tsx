import { AppWindow, DraggableTopBar } from '@shared/components'
import { AppFooter } from '@shared/components/AppFooter'
import { SFC, WindowProps } from '@shared/types'
import * as S from './Styles'
import { Top } from './Top'

export const SIAManager: SFC<WindowProps> = ({ className }) => {
  return (
    <>
      <AppWindow className={className} display={true}>
        <S.Container>
          <DraggableTopBar />
          <S.Header></S.Header>
          <S.Body>
            <S.Configuration>
              <Top />
            </S.Configuration>
          </S.Body>
          <S.Footer>
            <AppFooter />
          </S.Footer>
        </S.Container>
      </AppWindow>
    </>
  )
}
