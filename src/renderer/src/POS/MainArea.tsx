import { AppProps, SFC } from '@shared/types'
import { Box, Typography } from '@mui/material'
import { useSync } from '../App/hooks'
import { SyncStatusBadge } from '../App/components'

export const POSMainArea: SFC<AppProps> = ({ className, display }) => {
  useSync()
  return (
    <Box className={className} display={display ? 'flex' : 'none'} sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 9999 }}>
        <SyncStatusBadge />
      </div>
      <Box className="flex h-screen w-full flex-col items-center justify-center bg-gray-100">
        <Typography variant="h2" className="text-blue-600 font-bold mb-4">
          iSIA POS Subsystem
        </Typography>
        <Typography variant="h5" className="text-gray-600">
          POS Module Placeholder
        </Typography>
      </Box>
    </Box>
  )
}
