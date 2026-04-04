import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import { AccessTime as TimeIcon, Payments as CashIcon } from '@mui/icons-material'
import { useShift } from '../../../hooks/use-shift'

interface ShiftModalProps {
  userId: number
  terminalId: number
  onSuccess: (shift: any) => void
}

export const ShiftModal: React.FC<ShiftModalProps> = ({ userId, terminalId, onSuccess }) => {
  const [startingCash, setStartingCash] = useState('0')
  const { useStatus, useOpenMutation } = useShift(userId, terminalId)
  
  const { data: currentShift, isLoading } = useStatus()
  const openShift = useOpenMutation()

  const handleOpenShift = async () => {
    try {
      const shift = await openShift.mutateAsync(parseFloat(startingCash))
      onSuccess(shift)
    } catch (err) {
      console.error('Failed to open shift:', err)
    }
  }

  // If already open, we trigger onSuccess immediately and don't show modal
  // This logic is usually handled by the orchestrator but here for completeness
  if (currentShift) {
    onSuccess(currentShift)
    return null
  }

  return (
    <Dialog open={!currentShift && !isLoading} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ bgcolor: 'secondary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
        <TimeIcon />
        <Typography variant="h6">Open New Shift</Typography>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          You must open a new cashier shift before you can process any transactions.
        </Typography>

        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Starting Cash (Float)"
            type="number"
            value={startingCash}
            onChange={(e) => setStartingCash(e.target.value)}
            InputProps={{
              startAdornment: <CashIcon sx={{ mr: 1, color: 'action.active' }} />
            }}
            helperText="Enter the amount of cash currently in the drawer."
            autoFocus
          />
        </Box>

        {openShift.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {openShift.error?.message || 'Error opening shift.'}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Button 
          fullWidth 
          variant="contained" 
          size="large"
          onClick={handleOpenShift}
          disabled={openShift.isPending}
        >
          {openShift.isPending ? <CircularProgress size={24} /> : 'Open Shift & Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
