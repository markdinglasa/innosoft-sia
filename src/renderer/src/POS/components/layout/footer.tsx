import SyncIcon from '@mui/icons-material/Sync'
import WifiIcon from '@mui/icons-material/Wifi'
import { Box, Stack, Typography, styled } from '@mui/material'
import { APP_VERSION } from "@shared/constants"
import { colors } from "@shared/styles"
import { FC } from 'react'

const FooterWrapper = styled(Box)(() => ({
  height: '3rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 16px',
  backgroundColor: '#14263E', // theme.palette.primary.main
  color: 'white',
  borderTop: '1px solid rgba(255,255,255,0.1)',

}))

export const Footer: FC = () => {
  return (
    <FooterWrapper>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          NUTSHELL Version: {APP_VERSION}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Terminal ID: POS-101
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="caption" sx={{ color: colors.secondary, fontWeight: 'bold' }}>
          <SyncIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 0.5 }} />
          Synced
        </Typography>
        <Typography variant="caption" sx={{ color: colors.secondary, fontWeight: 'bold' }}>
          <WifiIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 0.5 }} />
          Online
        </Typography>
      </Stack>
    </FooterWrapper>
  )
}
