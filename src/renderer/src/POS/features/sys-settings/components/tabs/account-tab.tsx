import { Avatar, Box, Button, Divider, Paper, TextField, Typography } from '@mui/material'
import React from 'react'

export const AccountTab: React.FC = () => {
  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mr: 2 }}>U</Avatar>
          <Box>
            <Typography variant="h6">User Profile</Typography>
            <Typography variant="body2" color="text.secondary">Manage your personal account settings</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label="Full Name" 
            defaultValue="Mark Dinglasa" 
            fullWidth 
            size="small"
            disabled
          />
          <TextField 
            label="Email Address" 
            defaultValue="mark@innosoft.com" 
            fullWidth 
            size="small"
            disabled
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Security</Typography>
            <Button variant="outlined" color="primary" size="small">
              Change Password
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
