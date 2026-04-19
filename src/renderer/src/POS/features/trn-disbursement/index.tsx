import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { DisbursementList } from './components/disbursement-list'
import { useDisbursementHubStore } from './store/use-disbursement-hub-store'
import DisbursementForm from './components/disbursement-form'

const DisbursementHub: React.FC = () => {
  const { searchKeyword, setSearchKeyword, isFormOpen, setIsFormOpen, setSelectedId } = useDisbursementHubStore()
  
  const handleCreate = () => { 
    setSelectedId(null)
    setIsFormOpen(true) 
  }

  return (
    <PageLayout title="Disbursement Management">
      <Box sx={{ mb: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.paper' }}>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="Search disbursements..." 
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
            startIcon={<AddIcon sx={{ fontSize: 25 }} />} 
            onClick={handleCreate} 
            sx={{ px: 3, whiteSpace: 'nowrap' }}
          >
            New Disbursement
          </Button>
        </Paper>
      </Box>
      
      <Box sx={{ flexGrow: 1 }}>
        <DisbursementList />
      </Box>

      <Drawer 
        anchor="right" 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        PaperProps={{ 
          sx: { 
            width: { xs: '100%', sm: 600, md: 700, lg: 800 }, 
            borderRadius: '12px 0 0 12px' 
          } 
        }}
      >
        <DisbursementForm />
      </Drawer>
    </PageLayout>
  )
}

export default DisbursementHub

