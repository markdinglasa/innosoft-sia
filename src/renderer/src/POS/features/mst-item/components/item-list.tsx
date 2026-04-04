import { Delete as DeleteIcon, Edit as EditIcon, Inventory as ItemIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
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
import { useItemHubStore } from '../store/use-item-hub-store'

export const ItemList: React.FC = () => {
  const { searchKeyword, setSelectedItemId, setIsFormOpen } = useItemHubStore()
  const { useList, useDeleteMutation } = useMasterfile('item')

  const { data, isLoading, isError } = useList({ searchKeyword })
  const deleteMutation = useDeleteMutation()

  const handleEdit = (id: number) => {
    setSelectedItemId(id)
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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (isError) {
    return <Typography color="error">Failed to load items.</Typography>
  }

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
              <TableCell>Item</TableCell>
              <TableCell>Code / Barcode</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Cost</TableCell>
              <TableCell align="right">Price</TableCell>
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
                  <ItemIcon color="action" sx={{ fontSize: 25 }} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.description || 'No description'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" display="block">
                    Code: {item.itemCode}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Bar: {item.barCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={item.category || 'General'} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">{Number(item.cost).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {Number(item.price).toFixed(2)}
                  </Typography>
                </TableCell>
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
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No items found.
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
          <DialogContentText>Delete this item? This cannot be undone.</DialogContentText>
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

