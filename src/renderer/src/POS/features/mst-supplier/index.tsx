import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { SupplierForm } from './components/supplier-form'
import { SupplierList } from './components/supplier-list'
import { useSupplierHubStore } from './store/use-supplier-hub-store'

const SupplierHub: React.FC = () => {
  const { 
    searchKeyword, 
    setSearchKeyword, 
    isFormOpen, 
    setIsFormOpen, 
    setSelectedSupplierId 
  } = useSupplierHubStore()

  const handleCreate = () => {
    setSelectedSupplierId(null)
    setIsFormOpen(true)
  }

  return (
    <PageLayout title="Supplier Registry">
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
            placeholder="Search suppliers by name, TIN, or address..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ px: 3, whiteSpace: 'nowrap' }}
          >
            New Supplier
          </Button>
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <SupplierList />
      </Box>

      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 450, md: 550 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <SupplierForm />
      </Drawer>
    </PageLayout>
  )
}

export default SupplierHub
