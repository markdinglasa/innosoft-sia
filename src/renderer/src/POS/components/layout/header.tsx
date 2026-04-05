import { mdiCalendar } from '@mdi/js'
import MdiReactIcon from '@mdi/react'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PrinterIcon from '@mui/icons-material/Print'
import ScannerIcon from '@mui/icons-material/QrCodeScanner'
import { AppBar, Chip, Stack, Toolbar, Typography, styled } from '@mui/material'
import { colors } from '@shared/styles'
import { ButtonColor, ButtonType } from '@shared/types'
import { convertDate } from '@shared/utils'
import { FC } from 'react'
import { useSelector } from 'react-redux'
import { useRoute } from '../../hooks/use-route'
import { POSPages } from '../../types/pages'
import CircleButton from '../inputs/circle-button'
import ProfileDropdown from '../surfaces/profile-dropdown/profile-dropdown'

const StyledToolbar = styled(Toolbar)({
  height: '3rem',
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '#14263E', // Primary color from guidelines
  color: 'white'
})

interface HeaderProps {
  onMenuClick: () => void
}
export const Header: FC<HeaderProps> = (props: HeaderProps) => {
  const { onMenuClick } = props
  const { loginDate } = useSelector((state: any) => state.POS.manager)
  const { navigate } = useRoute()
  return (
    <AppBar position="static" elevation={0}>
      <StyledToolbar variant="dense">
        <Stack direction="row" spacing={2} alignItems="center">
          <CircleButton
            onClick={onMenuClick}
            icon={<MenuIcon sx={{ fontSize: 30 }} className="text-white" />}
            type={ButtonType.button}
            color={ButtonColor.blue}
          />
          {/* <img src={logo||''} alt="Innosoft" width={150} height={50} /> */}
          <div
            onClick={() => navigate(POSPages.DASHBOARD)}
            className="cursor-pointer flex items-center justify-center"
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              NUTSHELL
            </Typography>
          </div>
          {/* <Chip 
                    icon={<MdiReactIcon path={mdiStore} className="w-5 h-5"/>}
                        label={`${'Main'}`} 
                        sx={{fontSize:'0.9rem', height:30,paddingX:2,gap:1, color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} 
                        variant="outlined" 
                        
                    /> */}
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Chip
            icon={<MdiReactIcon path={mdiCalendar} className="w-5 h-5" />}
            label={`${convertDate(loginDate) || 'Not Set'}`}
            sx={{
              fontSize: '0.9rem',
              height: 30,
              paddingX: 2,
              gap: 1,
              color: 'white',
              borderColor: 'rgba(255,255,255,0.2)'
            }}
            variant="outlined"
          />
          {/* Peripheral Status */}
          <Stack direction="row" spacing={1.5}>
            <CircleButton
              icon={
                <PrinterIcon
                  sx={{ fontSize: 25, color: colors.white }}
                  titleAccess="Printer Online"
                />
              }
              type={ButtonType.button}
              color={ButtonColor.blue}
              onClick={() => {}}
            />
            <CircleButton
              icon={
                <ScannerIcon
                  sx={{ fontSize: 25, color: colors.white }}
                  titleAccess="Scanner Ready"
                />
              }
              type={ButtonType.button}
              color={ButtonColor.blue}
              onClick={() => {}}
            />
            <CircleButton
              icon={
                <NotificationsIcon
                  sx={{ fontSize: 25, color: colors.white }}
                  titleAccess="Notifications"
                />
              }
              type={ButtonType.button}
              color={ButtonColor.blue}
              onClick={() => navigate(POSPages.NOTIFICATIONS)}
            />
          </Stack>
          <ProfileDropdown />
        </Stack>
      </StyledToolbar>
    </AppBar>
  )
}

