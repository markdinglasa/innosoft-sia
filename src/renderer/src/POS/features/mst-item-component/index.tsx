import { Add as AddIcon, Close, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, IconButton, InputAdornment, Paper, TextField } from '@mui/material'
import { SystemPermissions } from '@shared/constants/permissions'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { useAccessControl } from '../../hooks'
import { ItemComponentForm } from './components/item-component-form'
import { ItemComponentList } from './components/item-component-list'
import { useItemComponentHubStore } from './store/use-item-component-hub-store'

const ItemComponentHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } =
    useItemComponentHubStore()

  const handleCreate = () => {
    setSelectedId(null)
    setIsFormOpen(true)
  }

  // permissions
  const { hasPermission } = useAccessControl()
  const canAdd = hasPermission(SystemPermissions.ITEM_COMPONENT_ADD)

  return (
    <PageLayout title="Item Components (BOM)">
      <Box sx={{ mb: 3 }}>
        <Paper
          variant="outlined"
          sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search item components..."
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
            New Component
          </Button>
        </Paper>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <ItemComponentList />
      </Box>
      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 450, md: 550 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <ItemComponentForm />
      </Drawer>
    </PageLayout>
  )
}
export default ItemComponentHub

