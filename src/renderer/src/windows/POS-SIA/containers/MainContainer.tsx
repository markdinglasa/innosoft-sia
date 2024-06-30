import { AppWindow } from '@shared/components'
import { SFC, WindowProps } from '@shared/types'

import * as S from './Styles'

export const SIAManager: SFC<WindowProps> = ({ className, display }) => {
  return (
    <>
      <AppWindow className={className} display={display}>
        <S.Container>
          <h1>Hellow World</h1>
        </S.Container>
      </AppWindow>
    </>
  )
}
