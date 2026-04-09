import { Add as AddIcon, Close, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, IconButton, InputAdornment, Paper, TextField } from '@mui/material'
import { SystemPermissions } from '@shared/constants/permissions'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { useAccessControl } from '../../hooks'
import { TableGroupForm } from './components/table-group-form'
import { TableGroupList } from './components/table-group-list'
import { useTableGroupHubStore } from './store/use-table-group-hub-store'

const TableGroupHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } =
    useTableGroupHubStore()

  const handleCreate = () => {
    setSelectedId(null)
    setIsFormOpen(true)
  }

  const { hasPermission } = useAccessControl()
  const canAdd = hasPermission(SystemPermissions.TABLE_GROUP_ADD)

  return (
    <PageLayout title="Table Group Management">
      <Box sx={{ mb: 3 }}>
        <Paper
          variant="outlined"
          sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search table groups..."
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
                    <Close sx={{ fontSize: 25 }} />
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
            New Table Group
          </Button>
        </Paper>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <TableGroupList />
      </Box>
      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400, md: 500 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <TableGroupForm />
      </Drawer>
    </PageLayout>
  )
}
export default TableGroupHub

