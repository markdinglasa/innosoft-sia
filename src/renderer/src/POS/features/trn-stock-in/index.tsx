import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { StockInList } from './components/stock-in-list'
import { useStockInHubStore } from './store/use-stock-in-hub-store'

const StockInHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } = useStockInHubStore()
  const handleCreate = () => { setSelectedId(null); setIsFormOpen(true) }
  return (
    <PageLayout title="Stock In">
      <Box sx={{ mb: 3 }}><Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}>
        <TextField fullWidth size="small" placeholder="Search stock-in..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ px: 3, whiteSpace: 'nowrap' }}>New Stock In</Button>
      </Paper></Box>
      <Box sx={{ flexGrow: 1 }}><StockInList /></Box>
      <Drawer anchor="right" open={isFormOpen} onClose={() => setIsFormOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 500, md: 600 }, borderRadius: '12px 0 0 12px' } }}>
        <Box sx={{ p: 3 }}><em>Stock-in form — coming soon</em></Box>
      </Drawer>
    </PageLayout>)
}
export default StockInHub
