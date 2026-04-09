import { Add as AddIcon, Close as CloseIcon, Inventory as PackageIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, IconButton, InputAdornment, Paper, TextField } from '@mui/material'
import { SystemPermissions } from '@shared/constants/permissions'
import React, { Suspense } from 'react'
import PageLayout from '../../components/layout/page-layout'
import { useAccessControl } from '../../hooks'
import { ItemPackageFormSkeleton } from './components/item-package-form-skeleton'
import { ItemPackageList } from './components/item-package-list'
import { useItemPackageHubStore } from './store/use-item-package-hub-store'

const ItemPackageForm = React.lazy(() =>
  import('./components/item-package-form').then((m) => ({ default: m.ItemPackageForm }))
)

const ItemPackageHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } =
    useItemPackageHubStore()

  const { hasPermission } = useAccessControl()
  const canAdd = hasPermission(SystemPermissions.ITEM_PACKAGE_ADD)

  const handleCreate = () => {
    setSelectedId(null)
    setIsFormOpen(true)
  }

  return (
    <PageLayout title="Item Packages">
      <Box sx={{ mb: 3 }}>
        <Paper
          variant="outlined"
          sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search item packages..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 25 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchKeyword('')}
                    hidden={!searchKeyword}
                  >
                    <CloseIcon sx={{ fontSize: 25 }} />
                  </IconButton>
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
            New Package
          </Button>
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <ItemPackageList />
      </Box>

      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400, md: 500 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <Suspense fallback={<ItemPackageFormSkeleton />}>
          <ItemPackageForm />
        </Suspense>
      </Drawer>
    </PageLayout>
  )
}

export default ItemPackageHub
