import { AppWindow } from '@shared/components'
import { AppFooter } from '@shared/components/AppFooter'
import { SFC, WindowProps } from '@shared/types'
import { DatabaseCard, SelectPathButton, Tenant } from '../components'
import { Initialize } from '../components/Initialize'
import * as S from './Styles'

export const SIAManager: SFC<WindowProps> = ({ className }) => {
  const handlePathSelect = (path: string) => {
    console.log('Selected path:', path)
  }

  return (
    <>
      <AppWindow className={className} display={true}>
        <S.Container>
          <S.Filler> 2024 © Mark Dinglasa </S.Filler>
          <S.Body>
            <S.Title>
              <S.H2> Innosoft Sales Insights and Analytics</S.H2>
            </S.Title>
            <S.Card>
              <DatabaseCard />
            </S.Card>
            <S.Card>
              <SelectPathButton onSelect={handlePathSelect} />
            </S.Card>
            <S.Card>
              <Tenant />
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
