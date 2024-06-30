import { AppWindow } from '@shared/components'
import { SFC, WindowProps } from '@shared/types'

import { Dashboard } from '../pages/Dashboard'
import * as S from './Styles'

export const SIAManager: SFC<WindowProps> = ({ className, display }) => {
  return (
    <>
      <AppWindow className={className} display={display}>
        <S.Container>
          <Dashboard />
        </S.Container>
      </AppWindow>
    </>
  )
}
