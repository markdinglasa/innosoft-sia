import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoveToInbox as StockIcon
} from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import React from 'react'
import { useMasterfile } from '../../../hooks/use-masterfile'
import { useStockOutHubStore } from '../store/use-stock-out-hub-store'

export const StockOutList: React.FC = () => {
  const { searchKeyword, setSelectedId, setIsFormOpen } = useStockOutHubStore()
  const { useList, useDeleteMutation } = useMasterfile('stockOut')
  const { data, isLoading, isError } = useList({ searchKeyword })
  const deleteMutation = useDeleteMutation()
  const handleEdit = (id: number) => {
    setSelectedId(id)
    setIsFormOpen(true)
  }
  const [deleteId, setDeleteId] = React.useState<number | null>(null)
  const handleDelete = (id: number) => setDeleteId(id)
  const confirmDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }
  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    )
  if (isError) return <Typography color="error">Failed to load stock-out records.</Typography>
  const items = (data as any)?.items || []
  return (
    <>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ maxHeight: 'calc(100vh - 250px)' }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell width={50}></TableCell>
              <TableCell>Stock Out #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item: any) => (
              <TableRow
                key={item.id}
                hover
                onClick={() => handleEdit(item.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <StockIcon color="action" sx={{ fontSize: 25 }} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {item.stockOutNumber || `SO-${item.id}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  {item.stockOutDate ? new Date(item.stockOutDate).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell>{item.remarks || '—'}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(item.id)
                    }}
                  >
                    <EditIcon sx={{ fontSize: 25 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(item.id)
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 25 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No stock-out records found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Delete this stock out? This cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

