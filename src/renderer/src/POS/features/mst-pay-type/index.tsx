import { Add as AddIcon, Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, IconButton, InputAdornment, Paper, TextField } from '@mui/material'
import { SystemPermissions } from '@shared/constants/permissions'
import React, { Suspense } from 'react'
import PageLayout from '../../components/layout/page-layout'
import { useAccessControl } from '../../hooks'
import { PayTypeForm } from './components/pay-type-form'
import { PayTypeFormSkeleton } from './components/pay-type-form-skeleton'
import { PayTypeList } from './components/pay-type-list'
import { usePayTypeHubStore } from './store/use-pay-type-hub-store'

const PayTypeHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } =
    usePayTypeHubStore()

  const { hasPermission } = useAccessControl()
  const canAdd = hasPermission(SystemPermissions.PAY_TYPE_ADD)

  const handleCreate = () => {
    setSelectedId(null)
    setIsFormOpen(true)
  }
  return (
    <PageLayout title="Pay Types">
      <Box sx={{ mb: 3 }}>
        <Paper
          variant="outlined"
          sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search payment types..."
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
            New Pay Type
          </Button>
        </Paper>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <PayTypeList />
      </Box>
      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400, md: 500 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <Suspense fallback={<PayTypeFormSkeleton />}>
          <PayTypeForm />
        </Suspense>
      </Drawer>
    </PageLayout>
  )
}
export default PayTypeHub

