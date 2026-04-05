import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import { SystemPermissions } from '@shared/constants/permissions'
import { lazy, memo, Suspense } from 'react'
import PageLayout from '../../components/layout/page-layout'
import { useAccessControl } from '../../hooks'
import { DiscountFormSkeleton } from './components/discount-form-skeleton'
import { DiscountList } from './components/discount-list'
import { useDiscountHubStore } from './store/use-discount-hub-store'

const DiscountForm = lazy(() => import('./components/discount-form'))

function DiscountHub() {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } =
    useDiscountHubStore()

  const handleCreate = () => {
    setSelectedId(null)
    setIsFormOpen(true)
  }

  // permissions
  const { hasPermission } = useAccessControl()
  const canAdd = hasPermission(SystemPermissions.DISCOUNT_ADD)

  return (
    <PageLayout title="Discounts">
      <Box sx={{ mb: 3 }}>
        <Paper
          variant="outlined"
          sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search discounts..."
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
            variant="contained"
            disabled={!canAdd}
            startIcon={<AddIcon sx={{ fontSize: 25 }} />}
            onClick={handleCreate}
            sx={{ px: 3, whiteSpace: 'nowrap' }}
          >
            New Discount
          </Button>
        </Paper>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <DiscountList />
      </Box>
      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 450, md: 550 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <Suspense fallback={<DiscountFormSkeleton />}>
          <DiscountForm />
        </Suspense>
      </Drawer>
    </PageLayout>
  )
}
export default memo(DiscountHub)

