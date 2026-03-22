import { Box, Typography } from '@mui/material'
import { AppProps, SFC } from '@shared/types'
import { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { SyncStatusBadge } from '../components/feedback/sync-status-badge'
import { useSync } from '../hooks/useSync'
import { POSPages } from "../types/pages"

const LoginPage = lazy(() => import("./(public)/login/page"))
const DatabaseLinkPage = lazy(() => import("./(public)/database-link/page"))
// Future modules can be added here
// const DashboardPage = lazy(() => import("./app/(protected)/dashboard/page"))

export const RootPage: SFC<AppProps> = ({ className }) => {
  useSync()
  const { activeUser, activePage } = useSelector((state: any) => state.POS.manager)
  const isAuthenticated = !!activeUser

  const Content = () => {
    if (!isAuthenticated) {
      if (activePage === POSPages.DATABASE_LINK) return <DatabaseLinkPage />
      return <LoginPage />
    }

    // Router logic based on activePage
    switch (activePage) {
      case POSPages.DATABASE_LINK:
        return <DatabaseLinkPage />
      case 'dashboard':
      default:
        return (
          <Box className="flex h-screen w-full flex-col items-center justify-center bg-gray-100">
            <Typography variant="h2" className="text-blue-600 font-bold mb-4">
              iPOS Subsystem
            </Typography>
            <Typography variant="h5" className="text-gray-600">
              Welcome, {activeUser?.name}!
            </Typography>
          </Box>
        )
    }
  }

  return (
    <Box className={className} sx={{ position: 'relative', width: '100vw', height: '100vh', border:'1px solid red' }}>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 9999 }}>
        <SyncStatusBadge />
      </div>
      <Suspense fallback={
        <Box className="flex h-screen w-full items-center justify-center">
          <Typography>Loading module...</Typography>
        </Box>
      }>
       <Content />
      </Suspense>
    </Box>
  )
}
