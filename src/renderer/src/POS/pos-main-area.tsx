import { Box, Typography } from '@mui/material'
import { AppProps, SFC } from '@shared/types'
import { SyncStatusBadge } from "./components/feedback/sync-status-badge"
import { useSync } from "./hooks/useSync"
import { useSelector } from 'react-redux'
import { lazy, Suspense } from 'react'

const LoginPage = lazy(() => import("./app/(public)/login/page"))
// Future modules can be added here
// const DashboardPage = lazy(() => import("./app/(protected)/dashboard/page"))

export const POSMainArea: SFC<AppProps> = ({ className, display }) => {
  useSync()
  const { activeUser, activePage } = useSelector((state: any) => state.POS.manager)
  const isAuthenticated = !!activeUser

  const renderContent = () => {
    if (!isAuthenticated) {
      return <LoginPage />
    }

    // Router logic based on activePage
    switch (activePage) {
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
    <Box className={className} display={display ? 'flex' : 'none'} sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 9999 }}>
        <SyncStatusBadge />
      </div>
      <Suspense fallback={
        <Box className="flex h-screen w-full items-center justify-center">
          <Typography>Loading module...</Typography>
        </Box>
      }>
        {renderContent()}
      </Suspense>
    </Box>
  )
}
