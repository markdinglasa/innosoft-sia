import { Box, Stack, Typography, styled } from '@mui/material'
import { APP_VERSION } from '@shared/constants'
import { RootState } from '@shared/types'
import { FC } from 'react'
import { useSelector } from 'react-redux'
import { SyncStatusBadge } from '../feedback'

const FooterWrapper = styled(Box)(() => ({
  height: '3rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 16px',
  backgroundColor: '#14263E', // theme.palette.primary.main
  color: 'white',
  borderTop: '1px solid rgba(255,255,255,0.1)'
}))

export const Footer: FC = () => {
  const activeTerminal = useSelector((state: RootState) => state.POS.manager.activeTerminal)
  const activeBranch = useSelector((state: RootState) => state.POS.manager.activeBranch)
  return (
    <>
      <FooterWrapper>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            NUTSHELL {APP_VERSION}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }} variant="caption">
            Terminal: {activeTerminal?.name || 'NA'}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }} variant="caption">
            Branch: {activeBranch?.name || 'NA'}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <SyncStatusBadge />
        </Stack>
      </FooterWrapper>
    </>
  )
}

