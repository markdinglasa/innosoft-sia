import { Monitor as TerminalIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { MstTerminalEntity } from 'src/main/entities'
import { setActiveTerminal } from '../../../store/manager'
import { useActivateTerminal } from '../api/sys-settings.mutations'
import { useAvailableTerminals } from '../api/sys-settings.queries'

interface TerminalActivationModalProps {
  open?: boolean
  close?: () => void
  isBlocking?: boolean
}
export const TerminalActivationModal: React.FC<TerminalActivationModalProps> = ({
  open = true,
  close,
  isBlocking = false
}) => {
  const {
    data: terminals = [],
    isLoading: isTerminalsLoading,
    refetch: refetchTerminals
  } = useAvailableTerminals()
  const activateTerminal = useActivateTerminal()

  const items = (terminals as any)?.items || []
  const options = Array.isArray(items) ? items : []
  const [selectedTerminalId, setSelectedTerminalId] = useState<number | null>(null)

  const loading = isTerminalsLoading || activateTerminal.isPending

  const dispatch = useDispatch()
  const handleActivate = () => {
    if (!selectedTerminalId) return
    activateTerminal.mutate(
      { terminalId: selectedTerminalId },
      {
        onSuccess: () => {
          const activatedTerminal = options.find((t: any) => t.id === selectedTerminalId)
          if (activatedTerminal) {
            const serializedTerminal = JSON.parse(JSON.stringify(activatedTerminal))
            dispatch(setActiveTerminal(serializedTerminal))
          }
          if (close) {
            close()
          }
        }
      }
    )
  }

  return (
    <Dialog
      open={open}
      onClose={isBlocking ? undefined : close}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <TerminalIcon />
        <Typography variant="h6" component="span">
          {isBlocking ? 'Terminal Activation Required' : 'Switch Terminal'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {isBlocking
            ? 'This machine is not yet associated with any terminal. Please select a terminal to activate.'
            : 'Select a terminal to switch to.'}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {isTerminalsLoading && options.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', mt: 1 }}>
            <List dense>
              {options.map((terminal: MstTerminalEntity) => (
                <ListItemButton
                  key={terminal.id}
                  selected={selectedTerminalId === terminal.id}
                  onClick={() => setSelectedTerminalId(terminal.id)}
                >
                  <ListItemIcon>
                    <TerminalIcon
                      color={selectedTerminalId === terminal.id ? 'primary' : 'inherit'}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={terminal.name}
                    secondary={terminal.branch?.name || 'No Branch'}
                  />
                </ListItemButton>
              ))}
              {options.length === 0 && !isTerminalsLoading && (
                <ListItem>
                  <ListItemText primary="No terminals found in the database." />
                </ListItem>
              )}
            </List>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
        {!isBlocking && (
          <Button disabled={loading} onClick={() => close?.()} variant="text" color="inherit">
            Cancel
          </Button>
        )}
        <Button
          disabled={loading}
          onClick={() => refetchTerminals()}
          variant="outlined"
          size="small"
        >
          Refresh
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          disabled={!selectedTerminalId || loading}
          onClick={handleActivate}
          sx={{ px: 4 }}
        >
          {activateTerminal.isPending ? <CircularProgress size={24} /> : 'Activate Terminal'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

