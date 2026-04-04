import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { ItemComponentForm } from './components/item-component-form'
import { ItemComponentList } from './components/item-component-list'
import { useItemComponentHubStore } from './store/use-item-component-hub-store'

const ItemComponentHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } = useItemComponentHubStore()
  const handleCreate = () => { setSelectedId(null); setIsFormOpen(true) }
  return (
    <PageLayout title="Item Component (BOM) Management">
      <Box sx={{ mb: 3 }}><Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}>
        <TextField fullWidth size="small" placeholder="Search item components..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ px: 3, whiteSpace: 'nowrap' }}>New Component</Button>
      </Paper></Box>
      <Box sx={{ flexGrow: 1 }}><ItemComponentList /></Box>
      <Drawer anchor="right" open={isFormOpen} onClose={() => setIsFormOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 450, md: 550 }, borderRadius: '12px 0 0 12px' } }}><ItemComponentForm /></Drawer>
    </PageLayout>)
}
export default ItemComponentHub
