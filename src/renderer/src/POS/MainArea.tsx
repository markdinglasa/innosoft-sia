import { AppWindow } from '@shared/components'
import { AppProps, SFC } from '@shared/types'
import { Box, Typography } from '@mui/material'

export const POSMainArea: SFC<AppProps> = ({ className, display }) => {
  return (
    <AppWindow className={className} display={display}>
      <Box className="flex h-screen w-full flex-col items-center justify-center bg-gray-100">
        <Typography variant="h2" className="text-blue-600 font-bold mb-4">
          iSIA POS Subsystem
        </Typography>
        <Typography variant="h5" className="text-gray-600">
          POS Module Placeholder
        </Typography>
      </Box>
    </AppWindow>
  )
}
