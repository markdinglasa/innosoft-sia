import { AppFooter, AppWindow } from '@shared/components'
import { SFC, WindowProps } from '@shared/types'
import * as S from './Styles'

export const AllianceManager: SFC<WindowProps> = ({ className, display }) => {
  return (
    <>
      <AppWindow className={className} display={display}>
        <S.Container className='container'>
          <S.Card>
            <h2>Alliance Tenant</h2>
            
          </S.Card>
          <AppFooter/>
        </S.Container >
        
      </AppWindow>
    </>
  )
}
