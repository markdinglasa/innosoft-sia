import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider,
} from '@mui/material'
import { Monitor as TerminalIcon, Fingerprint as FingerprintIcon } from '@mui/icons-material'
import { useAvailableTerminals, useTerminalFingerprint } from '../api/sys-settings.queries'
import { useActivateTerminal } from '../api/sys-settings.mutations'

export const TerminalActivationModal: React.FC = () => {
  const { data: fingerprint, isLoading: isFingerprintLoading } = useTerminalFingerprint()
  const { data: terminals = [], isLoading: isTerminalsLoading, refetch: refetchTerminals } = useAvailableTerminals()
  const activateTerminal = useActivateTerminal()

  const [selectedTerminalId, setSelectedTerminalId] = useState<number | null>(null)

  const loading = isFingerprintLoading || isTerminalsLoading || activateTerminal.isPending

  const handleActivate = () => {
    if (!selectedTerminalId || !fingerprint) return
    activateTerminal.mutate({
      terminalId: selectedTerminalId,
      fingerprint
    })
  }

  return (
    <Dialog 
        open={true} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
            sx: { borderRadius: 2 }
        }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <TerminalIcon />
        <Typography variant="h6">Terminal Activation Required</Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          This machine is not yet associated with any terminal. Please select a terminal record to bind this machine to.
        </Typography>

        <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
          <FingerprintIcon fontSize="small" color="action" />
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
            Fingerprint: {fingerprint || (isFingerprintLoading ? 'Resolving...' : 'Failed to get fingerprint')}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {isTerminalsLoading && terminals.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', mt: 1 }}>
            <List dense>
              {terminals.map((terminal: any) => (
                <ListItemButton 
                  key={terminal.id}
                  selected={selectedTerminalId === terminal.id}
                  onClick={() => setSelectedTerminalId(terminal.id)}
                  disabled={terminal.physicalAddress && terminal.physicalAddress !== fingerprint}
                >
                  <ListItemIcon>
                    <TerminalIcon color={selectedTerminalId === terminal.id ? "primary" : "inherit"} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={terminal.name} 
                    secondary={`${terminal.branch?.name || 'No Branch'} | ${terminal.terminal || 'No Code'}`}
                  />
                  {terminal.physicalAddress && terminal.physicalAddress !== fingerprint && (
                      <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
                          BOUND TO OTHER
                      </Typography>
                  )}
                  {terminal.physicalAddress === fingerprint && (
                       <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                          THIS MACHINE
                      </Typography>
                  )}
                </ListItemButton>
              ))}
              {terminals.length === 0 && !isTerminalsLoading && (
                <ListItem>
                  <ListItemText primary="No terminals found in the database." />
                </ListItem>
              )}
            </List>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
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
