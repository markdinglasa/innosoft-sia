import { AppWindow, DraggableTopBar } from '@shared/components'
import { AppFooter } from '@shared/components/AppFooter'
import { SFC, WindowProps } from '@shared/types'
import * as S from './Styles'

export const SIAManager: SFC<WindowProps> = ({ className }) => {
  return (
    <>
      <AppWindow className={className} display={true}>
        <S.Container>
          <DraggableTopBar />
          <S.Header> header</S.Header>
          <S.Body></S.Body>
          <S.Footer>
            <AppFooter />
          </S.Footer>
        </S.Container>
      </AppWindow>
    </>
  )
}
