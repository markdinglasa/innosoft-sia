import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Icon from '@mdi/react'
import { mdiRefresh, mdiClose, mdiAlertCircle, mdiCheckDecagram } from '@mdi/js'
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material'
import { ConnectivityChannel } from '@shared/constants'
import { SFC } from '@shared/types'

export const SyncManager: SFC<{ onClose: () => void }> = ({ onClose }) => {
  const [pendingItems, setPendingItems] = useState<any[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const syncStatus = useSelector((state: any) => state.sync)

  const fetchQueue = async () => {
    setIsRefreshing(true)
    try {
      // For the manager, we fetch ALL pending items (not just one table)
      // Since I doesn't have a "getAllPending" IPC yet, I'll fetch a broad list or just a summary
      // Let's assume we want a summary for now
      const items = await window.electron.ipc.invoke(ConnectivityChannel.getPendingByTable, '') 
      setPendingItems(items)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRetryAll = async () => {
    await window.electron.ipc.invoke(ConnectivityChannel.resetFailed)
    fetchQueue()
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  return (
    <Paper sx={{ p: 4, width: '80%', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Sync Queue Manager</Typography>
        <Box>
          <IconButton onClick={fetchQueue} disabled={isRefreshing}>
            <Icon path={mdiRefresh} size={1} />
          </IconButton>
          <IconButton onClick={onClose}>
            <Icon path={mdiClose} size={1} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="caption">Total Pending</Typography>
          <Typography variant="h4">{syncStatus.pendingCount}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2, flex: 1, textAlign: 'center', borderColor: 'error.main' }}>
          <Typography variant="caption" color="error">Failed Attempts</Typography>
          <Typography variant="h4" color="error">{pendingItems.filter(i => i.status === 'failed').length}</Typography>
        </Paper>
      </Box>

      <TableContainer sx={{ flex: 1 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Operation</TableCell>
              <TableCell>Table</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Retries</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.operation}</TableCell>
                <TableCell>{item.tableName}</TableCell>
                <TableCell>{item.entityId || 'New'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.status === 'failed' ? (
                      <Icon path={mdiAlertCircle} size={0.6} color="red" />
                    ) : (
                      <Icon path={mdiCheckDecagram} size={0.6} color="orange" />
                    )}
                    {item.status}
                  </Box>
                </TableCell>
                <TableCell>{item.retries}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleTimeString()}</TableCell>
              </TableRow>
            ))}
            {pendingItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">Queue is empty. Everything is synced!</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleRetryAll}>
          Retry Failed Items
        </Button>
      </Box>
    </Paper>
  )
}
