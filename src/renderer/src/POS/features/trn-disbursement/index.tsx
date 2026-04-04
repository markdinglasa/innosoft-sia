import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { DisbursementList } from './components/disbursement-list'
import { useDisbursementHubStore } from './store/use-disbursement-hub-store'

const DisbursementHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } = useDisbursementHubStore()
  const handleCreate = () => { setSelectedId(null); setIsFormOpen(true) }
  return (
    <PageLayout title="Disbursement Management">
      <Box sx={{ mb: 3 }}><Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}>
        <TextField fullWidth size="small" placeholder="Search disbursements..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ px: 3, whiteSpace: 'nowrap' }}>New Disbursement</Button>
      </Paper></Box>
      <Box sx={{ flexGrow: 1 }}><DisbursementList /></Box>
      <Drawer anchor="right" open={isFormOpen} onClose={() => setIsFormOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 500, md: 600 }, borderRadius: '12px 0 0 12px' } }}>
        <Box sx={{ p: 3 }}><em>Disbursement form — coming soon</em></Box>
      </Drawer>
    </PageLayout>)
}
export default DisbursementHub
