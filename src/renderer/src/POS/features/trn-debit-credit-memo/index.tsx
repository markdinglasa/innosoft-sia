import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { DebitCreditMemoList } from './components/debit-credit-memo-list'
import { useDebitCreditMemoHubStore } from './store/use-debit-credit-memo-hub-store'

const DebitCreditMemoHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } = useDebitCreditMemoHubStore()
  const handleCreate = () => { setSelectedId(null); setIsFormOpen(true) }
  return (
    <PageLayout title="Debit / Credit Memo">
      <Box sx={{ mb: 3 }}><Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}>
        <TextField fullWidth size="small" placeholder="Search memos..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ px: 3, whiteSpace: 'nowrap' }}>New Memo</Button>
      </Paper></Box>
      <Box sx={{ flexGrow: 1 }}><DebitCreditMemoList /></Box>
      <Drawer anchor="right" open={isFormOpen} onClose={() => setIsFormOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 500, md: 600 }, borderRadius: '12px 0 0 12px' } }}>
        <Box sx={{ p: 3 }}><em>Debit/Credit memo form — coming soon</em></Box>
      </Drawer>
    </PageLayout>)
}
export default DebitCreditMemoHub
