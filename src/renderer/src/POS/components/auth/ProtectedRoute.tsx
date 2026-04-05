import LockIcon from '@mui/icons-material/Lock'
import { Box, Button, Typography } from '@mui/material'
import { FC, ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setActivePage, setManager } from '../../store/manager'
import { POSPages } from '../../types/pages'
import { useHasPermission } from './RequirePermission'

interface ProtectedRouteProps {
  permissions: string | string[]
  requireAll?: boolean
  children: ReactNode
  redirectTo?: POSPages
  fallback?: ReactNode
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  permissions,
  requireAll = false,
  children,
  redirectTo,
  fallback
}) => {
  const dispatch = useDispatch()
  const hasPermission = useHasPermission(permissions, requireAll)

  useEffect(() => {
    if (!hasPermission && redirectTo) {
      dispatch(setActivePage(redirectTo))
    }
  }, [hasPermission, redirectTo, dispatch])

  // If there's a redirect, we shouldn't render anything while redirecting
  if (!hasPermission && redirectTo) return null

  // If no redirect provided, show fallback if exists, else show Forbidden UI
  if (!hasPermission) {
    if (fallback) return <>{fallback}</>

    return (
      <Box className="flex h-screen w-full flex-col items-center justify-center p-8 text-center bg-gray-100">
        <LockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          Access Restricted
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          You do not have the necessary permissions to view this screen. Please return to your
          designated workspace or request manager override.
        </Typography>
        <Button
          variant="outlined"
          size="large"
          onClick={() => dispatch(setActivePage(POSPages.DASHBOARD))}
        >
          Return to POS Terminal
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() =>
            dispatch(
              setManager({
                initialize: true,
                activeUser: null,
                activePage: null, // Default to dashboard after login
                activePermissions: [],
                loginDate: null,
                activeBranches: [],
                activeTerminal: null
              })
            )
          }
        >
          Logout
        </Button>
      </Box>
    )
  }

  return <>{children}</>
}

