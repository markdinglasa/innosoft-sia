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
    
  const Content = () => {
    // Step 1: Explicit routing based on activePage
    switch (activePage) {
      case POSPages.ADMIN_DASHBOARD:
        return (
          <ProtectedRoute permissions={SystemPermissions.USER_VIEW}>
            <POSLayout>
              <AdminDashboard />
            </POSLayout>
          </ProtectedRoute>
        )
      case POSPages.POS_CATALOG:
        return (
          <ProtectedRoute permissions={SystemPermissions.POS_RETAIL_VIEW}>
            <POSLayout>
              <POSCatalog />
            </POSLayout>
          </ProtectedRoute>
        )
      
      // Step 2: Fallback to user-type routing for the default dashboard/authenticated state
      case POSPages.DASHBOARD:
      case POSPages.AUTHENTICATED:
      default:
        switch (type) {
          case UserType.ADMINISTRATOR:
            return (
              <ProtectedRoute permissions={SystemPermissions.USER_VIEW}>
                 <POSLayout>
                  <AdminDashboard />
                 </POSLayout>
              </ProtectedRoute>
            )
          case UserType.CASHIER:
          case UserType.TELLER:
          default:
            return (
              <ProtectedRoute permissions={SystemPermissions.POS_RETAIL_VIEW}>
                <POSLayout>
                  <POSCatalog />
                </POSLayout>
              </ProtectedRoute>
            )
        }
    }
  }


  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
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
export default memo(ProtectedPage)