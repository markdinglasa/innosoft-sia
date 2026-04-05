import { mdiLockOffOutline } from '@mdi/js'
import MdiReactIcon from '@mdi/react'
import { Box, Button, Typography } from '@mui/material'
import { colors } from '@shared/styles'
import { memo } from 'react'
import { useRoute } from '../../hooks/use-route'
import { POSPages } from '../../types/pages'
import PageLayout from '../layout/page-layout'

function AccessDenied() {
  const { navigate } = useRoute()
  return (
    <Box className="">
      <PageLayout>
        <Box className="flex flex-col items-center justify-center min-h-screen">
          <Box className="flex flex-col items-center gap-2">
            <MdiReactIcon path={mdiLockOffOutline} size={4} color={colors.palette.neutral[400]} />
            <Typography
              variant="h1"
              sx={{ fontSize: '3rem', fontWeight: 'bold', color: colors.palette.neutral[400] }}
            >
              403
            </Typography>
            <Typography variant="h5" sx={{ color: colors.palette.neutral[500] }}>
              You don't have permission to access this page.
            </Typography>
            <Typography variant="caption" sx={{ color: colors.palette.neutral[600] }}>
              Please contact your administrator if you believe this is an error.
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(POSPages.DASHBOARD)}>
              Back to Home
            </Button>
          </Box>
        </Box>
      </PageLayout>
    </Box>
  )
}

export default memo(AccessDenied)

