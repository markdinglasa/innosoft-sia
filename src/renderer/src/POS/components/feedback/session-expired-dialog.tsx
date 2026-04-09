import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Box
} from '@mui/material'
import { LockClockOutlined } from '@mui/icons-material'

interface SessionExpiredDialogProps {
  open: boolean
  onClose: () => void
}

export const SessionExpiredDialog: React.FC<SessionExpiredDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="session-expired-title"
      aria-describedby="session-expired-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 1,
          maxWidth: 400
        }
      }}
    >
      <DialogTitle id="session-expired-title" sx={{ textAlign: 'center', pb: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
          <LockClockOutlined color="error" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h5" component="span" fontWeight="bold">
            Session Expired
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <DialogContentText id="session-expired-description" sx={{ py: 2 }}>
          Your session has reached its limit or has been invalidated. For your security, please log in again to continue your work.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{
            py: 1.5,
            fontWeight: 'bold',
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          LOG IN TO CONTINUE
        </Button>
      </DialogActions>
    </Dialog>
  )
}
