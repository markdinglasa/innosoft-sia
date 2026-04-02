import { Box, Typography } from '@mui/material'
import { SystemPermissions } from '@shared/constants/permissions'
import { lazy, memo, Suspense, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { POSLayout } from '../../components/layout/pos-layout'
import { POSPages } from '../../types/pages'

export enum UserType {
    ADMINISTRATOR = 'Administrator',
    CASHIER = 'CASHIER',
    TELLER = 'TELLER',
}
const AdminDashboard = lazy(() => import("./admin/page"))
const POSCatalog = lazy(() => import("./pos-catalog/page"))
/**
 * This procted-page would render the User interface base on what user-type is the user
 * @param param0 
 * @returns 
 */
function ProtectedPage() {
  const { activeUser, activePage } = useSelector((state: any) => state.POS.manager)
  const type = useMemo(() => activeUser?.type, [activeUser?.type])
    
  // Step 1: Mapping activePage to corresponding modules and permissions
  const { content, permissions } = useMemo(() => {
    switch (activePage) {
      case POSPages.ADMIN_DASHBOARD:
        return {
          content: <AdminDashboard />,
          permissions: SystemPermissions.USER_VIEW
        };
      case POSPages.POS_CATALOG:
        return {
          content: <POSCatalog />,
          permissions: SystemPermissions.POS_RETAIL_VIEW
        };
      case POSPages.DASHBOARD:
      case POSPages.AUTHENTICATED:
      default:
        switch (type) {
          case UserType.ADMINISTRATOR:
            return {
              content: <AdminDashboard />,
              permissions: SystemPermissions.USER_VIEW
            };
          default:
            return {
              content: <POSCatalog />,
              permissions: SystemPermissions.POS_RETAIL_VIEW
            };
        }
    }
  }, [activePage, type]);

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Suspense fallback={
        <Box className="flex h-screen w-full items-center justify-center">
          <Typography>Loading module...</Typography>
        </Box>
      }>
        <ProtectedRoute permissions={permissions}>
          <POSLayout>
            {content}
          </POSLayout>
        </ProtectedRoute>
      </Suspense>
    </Box>
  );
}
export default memo(ProtectedPage)