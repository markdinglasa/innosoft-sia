import { Box } from '@mui/material'
import { AppProps, SFC } from '@shared/types'
import { lazy } from 'react'
import { useSelector } from 'react-redux'
import { SyncStatusBadge } from '../components/feedback/sync-status-badge'
import { useSync } from '../hooks/useSync'
import { POSPages } from "../types/pages"

const LoginPage = lazy(() => import("./(public)/login/page"))
const DatabaseLinkPage = lazy(() => import("./(public)/database-link/page"))
const ProtectedPage = lazy(() => import("./(protected)/page"))

export const RootPage: SFC<AppProps> = ({ className }) => {
  useSync()
  const { activeUser, activePage } = useSelector((state: any) => state.POS.manager)
  const isAuthenticated = !!activeUser

  const Content = () => {
    if (!isAuthenticated) {
      if (activePage === POSPages.DATABASE_LINK) return <DatabaseLinkPage />
      return <LoginPage />
    }
    return <ProtectedPage />
  }

  return (
    <Box className={className} sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 9999 }}>
        {!isAuthenticated && <SyncStatusBadge />}
      </div>
       <Content />
    </Box>
  )
}
