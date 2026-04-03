import { Box } from '@mui/material'
import { Loader } from "@shared/components"
import { SystemPermissions } from '@shared/constants/permissions'
import { memo, Suspense, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { AccessDenied, NotFound } from '../../components/feedback'
import { POSLayout } from '../../components/layout/pos-layout'
import { POSPages } from '../../types/pages'
import { ROUTE_CONFIG } from './routes'

export enum UserType {
    ADMINISTRATOR = 'Administrator',
    CASHIER = 'CASHIER',
    TELLER = 'TELLER',
}

/**
 * This protected-page would render the User interface base on what user-type is the user
 */
function ProtectedPage() {
  const { activeUser, activePage } = useSelector((state: any) => state.POS.manager)
  const type = useMemo(() => activeUser?.type, [activeUser?.type])

  // Step 1: Mapping activePage to corresponding modules and permissions
  const { content, permissions } = useMemo(() => {
    // Check if directly in config
    const config = ROUTE_CONFIG[activePage];
    if (config) {
      return config;
    }

    // Default fallbacks based on Page State (AUTHENTICATED/DASHBOARD/etc)
    if (activePage === POSPages.AUTHENTICATED || activePage === POSPages.DASHBOARD || !activePage) {
      if (type === UserType.ADMINISTRATOR) {
        return ROUTE_CONFIG[POSPages.ADMIN_DASHBOARD];
      }
      return ROUTE_CONFIG[POSPages.POS_CATALOG];
    }

    // Default Not Found if not in config and not a default state
    return {
      content: <NotFound />,
      permissions: SystemPermissions.USER_VIEW // Low floor for 404
    };
  }, [activePage, type]);

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Suspense fallback={<Loader />}>
        <ProtectedRoute permissions={permissions} fallback={<AccessDenied />}>
          <POSLayout>
            {content}
          </POSLayout>
        </ProtectedRoute>
      </Suspense>
    </Box>
  );
}
export default memo(ProtectedPage)