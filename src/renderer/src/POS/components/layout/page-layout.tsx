import { Box, Typography } from '@mui/material'
import { memo } from 'react'
import AccessControl from '../utils/access-control'

interface PageLayoutProps {
  title?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

function PageLayout(props: PageLayoutProps) {
  const { title, children, actions } = props
  return (
    <Box className="flex h-full w-full flex-col min-h-screen relative">
      <AccessControl condition={!!title}>
        <Box className="flex items-center justify-between">
          <Typography variant="h4" className="pb-6 mb-6">
            {title}
          </Typography>
          <AccessControl condition={!!actions}>{actions}</AccessControl>
        </Box>
      </AccessControl>
      <Box>{children}</Box>
    </Box>
  )
}

export default memo(PageLayout)

