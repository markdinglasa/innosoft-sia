import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { CustomerForm } from './components/customer-form'
import { CustomerList } from './components/customer-list'
import { useCustomerHubStore } from './store/use-customer-hub-store'

const CustomerHub: React.FC = () => {
  const { 
    searchKeyword, 
    setSearchKeyword, 
    isFormOpen, 
    setIsFormOpen, 
    setSelectedCustomerId 
  } = useCustomerHubStore()

  const handleCreate = () => {
    setSelectedCustomerId(null)
    setIsFormOpen(true)
  }

  return (
    <PageLayout title="Customer Management">
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
            placeholder="Search customers by name, code, or contact details..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 25 }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 25 }} />}
            onClick={handleCreate}
            sx={{ px: 3, whiteSpace: 'nowrap' }}
          >
            New Customer
          </Button>
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <CustomerList />
      </Box>

      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 450, md: 550 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <CustomerForm />
      </Drawer>
    </PageLayout>
  )
}

export default CustomerHub
