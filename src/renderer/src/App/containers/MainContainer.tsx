import SettingsIcon from '@mui/icons-material/Settings'
import IconButton from '@mui/material/IconButton'
import { AppFooter, AppWindow } from '@shared/components'
import { useToggle } from '@shared/hooks'
import { colors } from '@shared/styles'
import { AppProps, SFC, Theme } from '@shared/types'
import { useSelector } from 'react-redux'
import { DatabaseCard, SelectPathButton, Tenant } from '../components'
import { Initialize } from '../components/Initialize'
import { SettingsModal } from '../modals'
import { getActiveTenant } from '../selectors'
import { Tenants } from '../types'
import * as S from './Styles'
export const SIAManager: SFC<AppProps> = ({ className }) => {
  const handlePathSelect = (path: string) => {
    console.log('Selected path:', path)
  }
  const activeTenant = useSelector(getActiveTenant)
  const [modalIsOpen, toggleModal] = useToggle(false)
  return (
    <>
      <AppWindow className={className} display={true}>
        <S.Container>
          <S.Filler> 2024 © Mark Dinglasa </S.Filler>
          <S.Body>
            {activeTenant !== Tenants.ALLIANCE && (
              <S.Title>
                <S.H2>Innosoft Sales and Insight Analytics</S.H2>
              </S.Title>
            )}
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
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end'
              }}
            >
              <IconButton
                onClick={toggleModal}
                aria-label="settings"
                sx={{ background: colors.secondary, '&:hover': { background: colors.pink } }}
              >
                <SettingsIcon sx={{ color: colors.primary }} />
              </IconButton>
            </div>
          </S.Body>
          <S.Footer>
            <AppFooter />
          </S.Footer>
        </S.Container>
      </AppWindow>
      {modalIsOpen && <SettingsModal close={toggleModal} theme={Theme.dark} />}
    </>
  )
}
