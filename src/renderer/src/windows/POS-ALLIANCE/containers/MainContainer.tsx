import { Initialize } from '@renderer/windows/POS-SIA/components/Initialize'
import { AppFooter, AppWindow } from '@shared/components'
import { SFC, WindowProps } from '@shared/types'
import { SelectPathButton, Tenant } from '../components'
import * as S from './Styles'

export const AllianceManager: SFC<WindowProps> = ({ className, display }) => {
  const handlePathSelect = (path: string) => {
    console.log('Selected path:', path)
  }
  return (
    <>
      <AppWindow className={className} display={display}>
        <S.Container className='container'>
          <S.Card>
            <S.Title>Sales Insight and Analytics</S.Title>
            <S.Item>
                <Tenant />
            </S.Item>
            <S.Item>
                <SelectPathButton onSelect={handlePathSelect} />
            </S.Item>
            <S.Item>
                <Initialize />
            </S.Item>
          </S.Card>
          <AppFooter/>
        </S.Container >
        
      </AppWindow>
    </>
  )
}
