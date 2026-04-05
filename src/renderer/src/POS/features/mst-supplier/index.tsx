import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import { SystemPermissions } from '@shared/constants/permissions'
import { lazy, Suspense } from 'react'
import PageLayout from '../../components/layout/page-layout'
import { useAccessControl } from '../../hooks'
import { SupplierFormSkeleton } from './components/supplier-form-skeleton'
import { SupplierList } from './components/supplier-list'
import { useSupplierHubStore } from './store/use-supplier-hub-store'

const SupplierForm = lazy(() => import('./components/supplier-form'))

function SupplierHub() {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedSupplierId } =
    useSupplierHubStore()

  const handleCreate = () => {
    setSelectedSupplierId(null)
    setIsFormOpen(true)
  }

  // permissions
  const { hasPermission } = useAccessControl()
  const canAdd = hasPermission(SystemPermissions.SUPPLIER_ADD)

  return (
    <PageLayout title="Suppliers">
      <Box sx={{ mb: 3 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            bgcolor: 'background.paper'
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search suppliers by name, TIN, or address..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 25 }} />
                </InputAdornment>
              )
            }}
          />
          <Button
            disabled={!canAdd}
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 25 }} />}
            onClick={handleCreate}
            sx={{ px: 3, whiteSpace: 'nowrap' }}
          >
            New Supplier
          </Button>
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <SupplierList />
      </Box>

      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 450, md: 550 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <Suspense fallback={<SupplierFormSkeleton />}>
          <SupplierForm />
        </Suspense>
      </Drawer>
    </PageLayout>
  )
}

export default SupplierHub

