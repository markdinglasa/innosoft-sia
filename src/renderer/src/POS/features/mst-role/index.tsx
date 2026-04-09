import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import React, { Suspense } from 'react'
import PageLayout from '../../components/layout/page-layout'
import { RoleFormSkeleton } from './components/role-form-skeleton'
import { RoleList } from './components/role-list'
import { useRoleHubStore } from './store/use-role-hub-store'

const RoleForm = React.lazy(() => import('./components/role-form'))

const RoleHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedRoleId } =
    useRoleHubStore()

  const handleCreate = () => {
    setSelectedRoleId(null)
    setIsFormOpen(true)
  }

  return (
    <PageLayout title="Role & Permission Management">
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
            placeholder="Search roles by name or code..."
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
            color="primary"
            startIcon={<AddIcon sx={{ fontSize: 25 }} />}
            onClick={handleCreate}
            sx={{ px: 3, whiteSpace: 'nowrap' }}
          >
            New Role
          </Button>
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <RoleList />
      </Box>

      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 450, md: 550 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <Suspense fallback={<RoleFormSkeleton />}>
          <RoleForm />
        </Suspense>
      </Drawer>
    </PageLayout>
  )
}

export default RoleHub

