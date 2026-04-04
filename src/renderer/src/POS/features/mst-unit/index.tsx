import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { UnitForm } from './components/unit-form'
import { UnitList } from './components/unit-list'
import { useUnitHubStore } from './store/use-unit-hub-store'

const UnitHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } = useUnitHubStore()

  const handleCreate = () => { setSelectedId(null); setIsFormOpen(true) }

  return (
    <PageLayout title="Unit Management">
      <Box sx={{ mb: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}>
          <TextField fullWidth size="small" placeholder="Search units..."
            value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ px: 3, whiteSpace: 'nowrap' }}>New Unit</Button>
        </Paper>
      </Box>
      <Box sx={{ flexGrow: 1 }}><UnitList /></Box>
      <Drawer anchor="right" open={isFormOpen} onClose={() => setIsFormOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400, md: 500 }, borderRadius: '12px 0 0 12px' } }}>
        <UnitForm />
      </Drawer>
    </PageLayout>
  )
}

export default UnitHub
