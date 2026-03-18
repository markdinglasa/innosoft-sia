import { AppFooter, AppWindow } from '@shared/components'
import { AppProps, SFC } from '@shared/types'
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom"
import { DatabaseCard, SelectPathButton, Tenant } from '../components'
import { AccessControl } from '../components/AccessControl'
import { Initialize } from '../components/Initialize'
import { Settings } from "../components/Settings"
import { getActiveTenant } from '../selectors'
import * as S from './Styles'

export const SIAManager: SFC<AppProps> = ({ className }) => {
  const handlePathSelect = (path: string) => {
    console.log('Selected path:', path)
  }
  const activeTenant = useSelector(getActiveTenant)

  const navigate = useNavigate()
  return (
    <>
      <AppWindow className={className} display={true}>
        <S.Container>
          {/* <S.Filler> 2024 © Mark Dinglasa </S.Filler> */}
          <S.Body>
            <S.Card>
              <button onClick={() => navigate('/login')}>Test</button>
            </S.Card>
            <S.Card>
              <DatabaseCard />
            </S.Card>
            <S.TwoColumnCard>
              <SelectPathButton onSelect={handlePathSelect} className="w-full" />
             <Settings />
            </S.TwoColumnCard>
            <S.Card>
              <Tenant />
            </S.Card>
            <AccessControl
              condition={!!activeTenant}
            >
              <S.Card>
                <Initialize />
              </S.Card>
            </AccessControl>
          
          </S.Body>
          <S.Footer>
            <AppFooter />
          </S.Footer>
        </S.Container>
      </AppWindow>
  </>
  )
}
