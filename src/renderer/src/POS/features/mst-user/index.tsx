import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import { Box, Button, Drawer, InputAdornment, Paper, TextField } from '@mui/material'
import React from 'react'
import PageLayout from '../../components/layout/page-layout'
import { UserForm } from './components/user-form'
import { UserList } from './components/user-list'
import { useUserHubStore } from './store/use-user-hub-store'

const UserHub: React.FC = () => {
  const { 
    searchKeyword, 
    setSearchKeyword,   
    isFormOpen, 
    setIsFormOpen, 
    setSelectedUserId 
  } = useUserHubStore()

  const handleCreate = () => {
    setSelectedUserId(null)
    setIsFormOpen(true)
  }

  return (
    <PageLayout title="User Management">
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
            placeholder="Search users (username, full name, email)..."
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
            New User
          </Button>
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <UserList />
      </Box>

      {/* Slide-out Form Drawer for Editing/Creation */}
      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 450, md: 550 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <UserForm />
      </Drawer>
    </PageLayout>
  )
}

export default UserHub
