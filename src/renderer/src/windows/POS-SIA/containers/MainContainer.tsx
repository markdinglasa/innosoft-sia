import { AppWindow, DraggableTopBar } from '@shared/components'
import { AppFooter } from '@shared/components/AppFooter'
import { SFC, WindowProps } from '@shared/types'
import { SelectPathButton } from '../components'
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
          <DraggableTopBar />
          <S.Header></S.Header>
          <S.Body>
            <S.Title>
              <S.H2> Innosoft Sales Insights and Analytics</S.H2>
            </S.Title>
            <S.Configuration>
              <Top />
            </S.Configuration>
            <S.Configuration>
              Select SIA Location
              <div>
                <h1>Select Path Example</h1>
                <SelectPathButton onSelect={handlePathSelect} />
              </div>
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
