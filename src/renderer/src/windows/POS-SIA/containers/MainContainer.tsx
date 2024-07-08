import { AppWindow } from '@shared/components'
import { AppFooter } from '@shared/components/AppFooter'
import { SFC, WindowProps } from '@shared/types'
import { SelectPathButton, SysCurrent } from '../components'
import { Initialize } from '../components/Initialize'
import * as S from './Styles'
import { Top } from './Top'

export const SIAManager: SFC<WindowProps> = ({ className }) => {
  const handlePathSelect = (path: string) => {
    console.log('Selected path:', path)
  }

  return (
    <>
      <AppWindow className={className} display={true}>
        <S.Container>
          <S.Body>
            <S.Title>
              <S.H2> Innosoft Sales Insights and Analytics</S.H2>
            </S.Title>
            <S.Card>
              <Top />
            </S.Card>
            <S.Card>
              <SelectPathButton onSelect={handlePathSelect} />
            </S.Card>
            <S.Card>
              <SysCurrent />
            </S.Card>
            <S.Card>
              <Initialize />
            </S.Card>
          </S.Body>
          <S.Footer>
            <AppFooter />
          </S.Footer>
        </S.Container>
      </AppWindow>
    </>
  )
}
