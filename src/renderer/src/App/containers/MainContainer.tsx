import SettingsIcon from '@mui/icons-material/Settings'
import IconButton from '@mui/material/IconButton'
import { AppFooter, AppWindow } from '@shared/components'
import { useToggle } from '@shared/hooks'
import { colors } from '@shared/styles'
import { AppProps, SFC, Theme } from '@shared/types'
import { useSelector } from 'react-redux'
import { DatabaseCard, SelectPathButton, Tenant } from '../components'
import { AccessControl } from '../components/AccessControl'
import { Initialize } from '../components/Initialize'
import { SettingsModal } from '../modals'
import { getActiveTenant } from '../selectors'
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
          {/* <S.Filler> 2024 © Mark Dinglasa </S.Filler> */}
          <S.Body>
            <S.Card>
              <DatabaseCard />
            </S.Card>
            <S.Card>
              <SelectPathButton onSelect={handlePathSelect} />
            </S.Card>
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
            <S.SettingsContainer>
              <IconButton
                onClick={toggleModal}
                aria-label="settings"
                sx={{ background: colors.secondary, '&:hover': { background: colors.pink } }}
              >
                <SettingsIcon sx={{ color: colors.primary }} />
              </IconButton>
            </S.SettingsContainer>
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
